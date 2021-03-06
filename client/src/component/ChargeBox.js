import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserInfo, updateState } from '../store/slices/userInfo';
import {
  selectSelectedPost,
  updatePostState,
} from '../store/slices/selectedPost';
import { selectPoint, inputPayment, confirmPay } from '../store/slices/point';
import Payment from './Payment';
import axios from 'axios';

const ChargeBoxContainer = styled.div`
  height: 250px;
  background-color: #f3f702;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  padding: 10px;
  border-radius: 10px;
  > p.header {
    width: 80%;
    font-weight: bold;
    padding-bottom: 5px;
    border-bottom: 1px solid black;
  }
  > input {
    font-size: 1rem;
    padding: 5px;
  }
  > button {
    font-size: 0.9rem;
    padding: 7px;
    background-color: #30302d;
    color: white;
    border-radius: 5px;
  }
  > p.standard {
  }
`;

const PayBox = styled.div`
  height: 150px;
  border: 3px solid black;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  padding: 10px;
  border-radius: 10px;
  > p {
    margin: 0;
  }
  > div.btns button {
    &:nth-child(1) {
      margin-right: 10px;
    }
  }
`;

export function PayWithPoints({ handleClick }) {
  const dispatch = useDispatch();
  const { targetPoint, id: infoId } = useSelector(selectSelectedPost);
  const { payNow } = useSelector(selectPoint);
  const { id: userId, point, accToken } = useSelector(selectUserInfo);

  const postConfig = {
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${accToken}`,
    },
    withCredentials: true,
  };

  //확인 클릭 --> 결제 진행(포인트 차감)
  useEffect(() => {
    const restPoint = Number(point) - Number(targetPoint);
    if (payNow) {
      //loading indicator start
      axios
        .post(
          `${process.env.REACT_APP_SERVER_DEV_URL}/info/${infoId}/order`,
          { restPoint, userId },
          postConfig,
        )
        .then((res) => {
          dispatch(updateState({ point: restPoint }));
          dispatch(updatePostState({ isPurchased: true }));
          alert('결제 성공');
        })
        .catch((err) => alert('결제 실패'));
      //loading indicator end
      handleClick(); //ContentPaid의 preStep --> false
      dispatch(
        confirmPay({
          answer: false,
        }),
      );
    }
  }, [payNow]);

  //point slice: payNow --> true, ContentPaid: preStep --> false
  const yes = () => {
    dispatch(
      confirmPay({
        answer: true,
      }),
    );
  };

  return (
    <PayBox>
      <p>{targetPoint} P가 차감됩니다.</p>
      <p>결제하시겠습니까?</p>
      <div className="btns">
        <button onClick={yes}>확인</button>
        <button onClick={handleClick}>취소</button>
      </div>
    </PayBox>
  );
}

export default function ChargeBox() {
  const dispatch = useDispatch();
  const { phone, email } = useSelector(selectUserInfo);

  return (
    <ChargeBoxContainer className="charge-box">
      <p className="header">결제방식 {'>'} 카카오페이</p>
      <input
        placeholder="금액 입력"
        type="number"
        min="3000"
        step="1000"
        onChange={(e) =>
          dispatch(
            inputPayment({
              amount: e.target.value,
              buyer_tel: phone,
              buyer_email: email,
            }),
          )
        }
      />
      <p className="standard" style={{ color: 'red' }}>
        3000원 이상부터 가능합니다.
      </p>
      <Payment />
    </ChargeBoxContainer>
  );
}
