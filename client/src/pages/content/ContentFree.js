import '../../css/Content.css';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Comment from '../../component/content/Comment';
import { useSelector, useDispatch } from 'react-redux';
import { selectUserInfo } from '../../store/slices/userInfo';
import {
  updatePostState,
  selectSelectedPost,
  addLike,
  cancelLike,
} from '../../store/slices/selectedPost';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileArrowDown } from '@fortawesome/free-solid-svg-icons';

function ContentFree() {
  const dispatch = useDispatch();
  const {
    id,
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
  } = useSelector(selectSelectedPost);

  const { isLogin } = useSelector(selectUserInfo);
  // const download = useRef(null);

  const likeClick = () => {
    //이미 추천한 게시글이면,
    if (like) {
      dispatch(cancelLike());
    } else {
      dispatch(addLike());
    }
    dispatch(updatePostState({ like: !like }));
  };

  return (
    <div>
      <strong>무료글 상세보기</strong>
      <p>무료컨텐츠 상세 페이지 입니다</p>
      <div className="container">
        <div className="title">{title}</div>
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
        <div className="body">{content}</div>
        <div className="like download" style={{ height: '50px' }}>
          <span onClick={likeClick}>
            {like ? '♥' : '♡'} {totalLikes}
          </span>
          {/* 아래 첨부파일은 회원만 다운 가능 */}
          <a
            // ref={download}
            href={
              isLogin
                ? `https://info-market-upload.s3.ap-northeast-2.amazonaws.com/${fileURL}`
                : '#'
            }
          >
            <FontAwesomeIcon
              icon={faFileArrowDown}
              style={{ fontSize: '1.5rem' }}
              onClick={() => !isLogin && alert('회원만 가능한 서비스입니다.')}
            />
          </a>
        </div>
        <Comment />
      </div>
    </div>
  );
}

export default ContentFree;
