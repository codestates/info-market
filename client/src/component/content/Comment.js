import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { selectUserInfo } from '../../store/slices/userInfo';
import {
  selectSelectedPost,
  addComment,
  deleteComment,
  modifyComment,
} from '../../store/slices/selectedPost';
import axios from 'axios';
import '../../css/Comment.css';

const RegisterBox = styled.div`
  display: flex;
  border: 1px solid lightgray;
  justify-content: space-between;
  align-items: center;
  > textarea {
    width: 80%;
  }
  > button {
    width: 10%;
    height: 30px;
    color: white;
    border: 0;
    border-radius: 4px;
    background: linear-gradient(162deg, #757677 0%, #888e97 70%, #a5a8ad 70%);
    margin-right: 15px;
  }
`;

// css 수정사항 - 댓글리스트 패딩 및 마진 설정
const CommentWrapper = styled.div`
  /* border: 3px solid pink; */
  font-family: '순천R';
  font-size: 0.9rem;
  padding: 5px;
  > div.rv-content {
    border: 2px solid lightgray;
    padding: 2%;
  }
`;

const UserInfoWrapper = styled.div`
  /* border: 1px solid red; */
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #eeeeee;
  /* margin: auto; */
`;

const RightBtns = styled.div`
  display: flex;
  /* justify-content: space-between; */
  align-items: center;
  > p.date {
    margin-left: 20px;
  }
`;

// css 수정사항 - 수정, 삭제 버튼분할
// UserInfoWrapper 에 margin : auto, button1(수정) 에 margin-left : auto 설정
const Button1 = styled.button`
  border: 0;
  /* height: 20px; */
  background: none;
  display: none;
  margin-left: auto;
  &.authorized {
    display: inline-block;
  }
`;

const Button2 = styled.button`
  border: 0;
  /* height: 20px; */
  background: none;
  display: none;
  &.authorized {
    display: inline-block;
  }
`;

const CommentText = styled.textarea``;

function Review({ review, userInfo, infoId, postConfig, getConfig }) {
  const dispatch = useDispatch();
  const textEl = useRef(null);
  const [editMode, setEditMode] = useState(false);
  const [modifyVal, setModifyVal] = useState(review.content);

  useEffect(() => {
    if (!editMode) return;
    textEl.current.focus();
  }, [editMode]);

  //댓글 수정 값
  const handleTextChange = (e) => {
    setModifyVal(e.target.value);
  };

  //댓글 수정 완료
  const chagneContent = (replyId) => {
    if (modifyVal === '') return alert('댓글을 작성해주세요.');
    axios
      .put(
        `${process.env.REACT_APP_SERVER_DEV_URL}/info/${infoId}/reply/${replyId}`,
        { content: modifyVal },
        postConfig,
      )
      .then((res) => {
        const { updatedAt } = res.data;
        dispatch(
          modifyComment({
            id: replyId,
            content: modifyVal,
            updatedAt,
          }),
        );
        setEditMode(false);
      })
      .catch((err) => alert('댓글 수정 실패'));
  };

  // 코멘트 삭제
  const remove = (ID) => {
    axios
      .delete(
        `${process.env.REACT_APP_SERVER_DEV_URL}/info/${infoId}/reply/${ID}`,
        getConfig,
      )
      .then((res) => {
        const { replyId } = res.data;

        if (Number(replyId) === Number(ID)) {
          dispatch(deleteComment({ replyId }));
        }
      })
      .catch((err) => alert('댓글 삭제 실패'));
  };

  //수정하다가 취소하기
  const modifyCancel = () => {
    setModifyVal(review.content);
    setEditMode(false);
  };

  return (
    <CommentWrapper>
      <UserInfoWrapper>
        {/* 수정과 버튼 태그 변경 및 순서 변경. 작성일자 아래로 내림 */}
        <p>{review.User.nickname}</p>
        <RightBtns>
          {editMode ? (
            <button
              className="modify-confirm"
              onClick={() => chagneContent(review.id)}
            >
              수정 완료
            </button>
          ) : (
            <Button1
              className={
                Number(review.userid) === Number(userInfo.id)
                  ? 'modify-btn authorized'
                  : 'modify-btn'
              }
              onClick={() => setEditMode(true)}
            >
              수정
            </Button1>
          )}
          {editMode || (
            <Button2
              className={
                (Number(review.userid) === Number(userInfo.id) ||
                  userInfo.grade === 'admin') &&
                'authorized'
              }
              onClick={() => remove(review.id)}
            >
              삭제
            </Button2>
          )}
          <p className="date">작성일자 : {review.createdAt}</p>
        </RightBtns>
      </UserInfoWrapper>
      {editMode ? (
        <div>
          <CommentText
            className="comment-text"
            cols="30"
            rows="20"
            ref={textEl}
            value={modifyVal}
            onChange={handleTextChange}
          />

          <button onClick={modifyCancel}>취소</button>
        </div>
      ) : (
        <div className="rv-content">
          <pre>{review.content}</pre>
        </div>
      )}
    </CommentWrapper>
  );
}

///////////////////////////////////////////
function Comment() {
  const dispatch = useDispatch();
  const { id: infoId, reviews } = useSelector(selectSelectedPost);
  const userInfo = useSelector(selectUserInfo);

  const [input, setInput] = useState('');

  const postConfig = {
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${userInfo.accToken}`,
    },
    withCredentials: true,
  };
  const getConfig = {
    headers: {
      Authorization: `Bearer ${userInfo.accToken}`,
    },
    withCredentials: true,
  };

  //댓글 입력
  const handleChange = (e) => {
    setInput(e.target.value);
  };

  // 댓글 추가
  const add = () => {
    if (!input) return alert('댓글을 작성해주세요.');
    axios
      .post(
        `${process.env.REACT_APP_SERVER_DEV_URL}/info/${infoId}/reply`,
        { content: input },
        postConfig,
      )
      .then((res) => {
        let { replyId, createdAt } = res.data;
        let day = createdAt.split('T');
        let time = day[1].split('.')[0];
        createdAt = `${day[0]} ${time}`;

        const { nickname, id: userid } = userInfo;
        dispatch(
          addComment({
            reply: {
              id: replyId,
              userid,
              content: input,
              createdAt,
              User: { nickname },
            },
          }),
        );
        setInput('');
      })
      .catch((err) => alert('댓글 작성 실패'));
  };

  return (
    <>
      <RegisterBox>
        <textarea
          className="comment-text"
          value={input}
          onChange={handleChange}
          placeholder="댓글을 작성하려면 로그인 해주세요."
          disabled={!userInfo.isLogin}
        />
        <button
          className="comment-btn"
          onClick={add}
          disabled={!userInfo.isLogin}
        >
          등록
        </button>
      </RegisterBox>
      {reviews.map((R) => (
        <Review
          key={R.id}
          review={R}
          infoId={infoId}
          postConfig={postConfig}
          getConfig={getConfig}
          userInfo={userInfo}
        />
      ))}
    </>
  );
}

export default Comment;
