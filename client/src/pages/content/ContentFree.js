import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Comment from '../../component/content/Comment';
import { useSelector, useDispatch } from 'react-redux';
import { selectUserInfo } from '../../store/slices/userInfo';
import {
  updatePostState,
  selectSelectedPost,
  addLike,
  cancelLike,
  cancelModify,
  deleteFile,
} from '../../store/slices/selectedPost';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileArrowDown,
  faGear,
  faCircleMinus,
} from '@fortawesome/free-solid-svg-icons';
import Setting from '../../component/content/Setting';
import Modal from '../../modals/Modal-1';
import FileChange from '../../component/content/FileChange';

const EntireContainer = styled.div`
  * {
    box-sizing: border-box;
    word-break: keep-all;
    font-family: 'Elice Bold';
    font-family: '순천B';
  }
`;

const ContentContainer = styled.div`
  width: 100vw;
  /* height: 100vh; */
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;
const Container = styled.div`
  width: 800px;
  border-radius: 10px;
  border: 2px solid black;
  background-color: white;
  > .title {
    padding: 15px;
    border-bottom: 1px solid #999;
  }
  > .info {
    padding: 15px;
    border-bottom: 1px solid #999;
    > dl {
      position: relative;
      display: inline-block;
      padding: 0 20px;
      > :first-child {
        padding-left: 0;
      }
      > ::before {
        position: absolute;
        display: block;
        top: 0;
        left: 0;
        width: 1px;
        height: 25px;
        background: #ddd;
      }
      > :first-child::before {
        display: none;
      }
      > dt,
      dd {
        display: inline-block;
      }
      > dd {
        margin-left: 10px;
        color: gray;
      }
    }
  }
  > .body {
    display: inline-block;
    padding: 15px;
    border-bottom: 1px solid #000;
    line-height: 160%;
    font-size: 1.2rem;
  }
`;

const Like = styled.div`
  display: flex;
  justify-content: center;
  font-size: 30px;
`;
const LikeDownload = styled.div`
  display: flex;
  justify-content: center;
`;

const SettingBox = styled.span`
  position: relative;
  &.logined {
    display: none;
  }
`;

const RemoveBox = styled.div``;

const ContentBox = styled.textarea`
  width: 100%;
  height: 500px;
  padding: 10px;
  box-sizing: border-box;
  font-size: 1rem;
`;

function RemoveInfoConfirm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { accToken } = useSelector(selectUserInfo);
  const { id: infoId } = useSelector(selectSelectedPost);

  const getConfig = {
    headers: {
      Authorization: `Bearer ${accToken}`,
    },
    withCredentials: true,
  };

  const handleInfoDelete = () => {
    //게시글 첨부파일도 삭제해야 함!!
    axios
      .delete(
        `${process.env.REACT_APP_SERVER_DEV_URL}/info/${infoId}`,
        getConfig,
      )
      .then((res) => {
        dispatch(deleteFile());
        alert(res.data.message);
      })
      .catch((err) => alert(err.response.message));

    dispatch(updatePostState({ removeInfo: false }));
    navigate(-1); //다시 렌더링되는지 확인
  };

  return (
    <RemoveBox>
      <p>삭제하시겠습니까?</p>
      <div>
        <button onClick={handleInfoDelete}>확인</button>
        <button
          onClick={() => dispatch(updatePostState({ removeInfo: false }))}
        >
          취소
        </button>
      </div>
    </RemoveBox>
  );
}

function ContentFree() {
  const dispatch = useDispatch();
  const {
    id: infoId,
    userId,
    title,
    nickname,
    content,
    totalLikes,
    reviews,
    totalViews,
    like,
    createdAt,
    updatedAt,
    fileURL,
    isOpen,
    removeInfo,
    infoEditMode,
    titleChange,
    contentChange,
    fileChange,
    modifyTextStep,
    modyfiedFileName,
  } = useSelector(selectSelectedPost);
  const { id, isLogin, accToken } = useSelector(selectUserInfo);
  const [localTitle, setLocalTitle] = useState(title);
  const [localContent, setLocalContent] = useState(content);

  const getConfig = {
    headers: {
      Authorization: `Bearer ${accToken}`,
    },
    withCredentials: true,
  };

  const likeClick = () => {
    //자신의 게시물이면 좋아요 못 누름.
    if (id === userId)
      return alert('자신의 게시물에는 좋아요를 누를 수 없습니다.');
    if (like) {
      //좋아요 취소.
      axios
        .delete(
          `${process.env.REACT_APP_SERVER_DEV_URL}/info/${infoId}/like`,
          getConfig,
        )
        .then((res) => {
          dispatch(cancelLike());
          dispatch(updatePostState({ like: !like }));
        })
        .catch((err) => alert('좋아요 취소 반영 안 됨.'));
    } else {
      // 좋아요 누름.
      axios
        .put(
          `${process.env.REACT_APP_SERVER_DEV_URL}/info/${infoId}/like`,
          '',
          getConfig,
        )
        .then((res) => {
          dispatch(addLike());
          dispatch(updatePostState({ like: !like }));
        })
        .catch(
          (err) =>
            err.response.data?.message && alert(err.response.data.message),
        );
    }
  };

  //텍스트 수정 처리
  useEffect(() => {
    if (!modifyTextStep) return;
    axios
      .put(
        `${process.env.REACT_APP_SERVER_DEV_URL}/info/${infoId}`,
        {
          title: localTitle,
          content: localContent,
          file: modyfiedFileName,
        },
        getConfig,
      )
      .then((res) => {
        dispatch(
          updatePostState({
            title: localTitle,
            content: localContent,
            fileURL: modyfiedFileName,
          }),
        );
      })
      .catch((err) => {
        if (err.response?.message) alert(err.response.message);
      });

    dispatch(cancelModify());
  }, [modifyTextStep]);

  //텍스트, 파일 수정 단계를 분리시켜주는 코드
  const handleModifyReady = () => {
    if (!titleChange && !contentChange && !fileChange)
      return dispatch(updatePostState({ infoEditMode: false }));

    if (fileChange)
      return dispatch(
        updatePostState({
          modifyFileStep: true,
        }),
      );

    dispatch(
      updatePostState({
        modifyTextStep: true,
      }),
    );
  };

  return (
    <EntireContainer>
      <ContentContainer>
        {removeInfo && (
          <Modal
            handleBtnClick={() =>
              dispatch(updatePostState({ removeInfo: false }))
            }
            content={<RemoveInfoConfirm />}
            role="remove"
          />
        )}
        <Container>
          {infoEditMode ? (
            <textarea
              cols="50"
              rows="1"
              style={{ height: '2rem' }}
              onChange={(e) => {
                setLocalTitle(e.target.value);
                dispatch(updatePostState({ titleChange: true }));
              }}
              value={localTitle}
            />
          ) : (
            <div className="title">{localTitle}</div>
          )}
          <SettingBox className={`setting ${isLogin || 'logined'}`}>
            <FontAwesomeIcon
              icon={isOpen ? faCircleMinus : faGear}
              onClick={() => dispatch(updatePostState({ isOpen: !isOpen }))}
            />
            {isOpen && <Setting />}
          </SettingBox>
          <div className="info">
            <dl>
              <dt>작성자</dt>
              <dd>{nickname}</dd>
            </dl>
            <dl>
              <dt>작성일자</dt>
              <dd>{createdAt}</dd>
            </dl>
            <dl>
              <dt>조회수</dt>
              <dd>{totalViews}</dd>
            </dl>
            <dl>
              <dt>추천수</dt>
              <dd>{totalLikes}</dd>
            </dl>
          </div>
          {infoEditMode ? (
            <textarea
              cols="30"
              rows="50"
              onChange={(e) => {
                setLocalContent(e.target.value);
                dispatch(updatePostState({ contentChange: true }));
              }}
              value={localContent}
            />
          ) : (
            <ContentBox readOnly className="body" value={localContent} />
          )}
          <Like onClick={likeClick} style={{ cursor: 'pointer' }}>
            {like ? '♥' : '♡'} {totalLikes}
          </Like>
          <LikeDownload style={{ height: '50px' }}>
            {/* 아래 첨부파일은 회원만 다운 가능 */}
            {infoEditMode ? (
              <FileChange />
            ) : (
              //css 끝나면 !fileURL --> fileURL로 바꾸기
              !fileURL && (
                <a
                  href={
                    isLogin
                      ? `https://${process.env.REACT_APP_AWS_BUCKET}.s3.${process.env.REACT_APP_AWS_DEFAULT_REGION}.amazonaws.com/${fileURL}`
                      : '#'
                  }
                >
                  <FontAwesomeIcon
                    icon={faFileArrowDown}
                    style={{ fontSize: '1.5rem' }}
                    onClick={() =>
                      !isLogin && alert('회원만 가능한 서비스입니다.')
                    }
                  />
                  다운로드
                </a>
              )
            )}
            {infoEditMode && (
              <button onClick={handleModifyReady}>수정 완료</button>
            )}
            {infoEditMode && (
              <button onClick={() => dispatch(cancelModify())}>취소</button>
            )}
          </LikeDownload>
          <Comment />
        </Container>
      </ContentContainer>
    </EntireContainer>
  );
}

export default ContentFree;
