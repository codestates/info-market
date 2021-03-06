import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../../store/slices/userInfo';
import { useNavigate } from 'react-router-dom';
import AWS from 'aws-sdk';
import { v1, v3, v4, v5 } from 'uuid';

const ACCESS_KEY = process.env.REACT_APP_AWS_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.REACT_APP_AWS_SECRET_ACCESS_KEY;
const REGION = process.env.REACT_APP_AWS_DEFAULT_REGION;
const S3_BUCKET = process.env.REACT_APP_AWS_BUCKET;

AWS.config.update({
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_ACCESS_KEY,
});

const myBucket = new AWS.S3({
  params: { Bucket: S3_BUCKET },
  region: REGION,
});

const WritingContainer = styled.div`
  border: 3px solid orange;
  background-color: white;
  height: 80%;
  width: 100%;
  border-radius: 10px;
  > form {
    /* border: 3px solid yellow; */
    height: 100%;
    width: 99%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    > textarea {
      font-size: 1rem;
      width: 95%;
      padding: 1%;
      &#title {
        margin-top: 2%;
        margin-bottom: 2%;
        height: 2rem;
        /* resize: none;
        overflow: hidden; */
      }
      &#content {
        flex-grow: 1;
      }
    }
    > div.submit {
      margin-bottom: 10px;
      display: flex;
      width: 95%;
      justify-content: flex-end;
      align-items: center;
      /* border: 1px solid green; */
      > span.msg {
        display: none;
        &.alert {
          display: inline-block;
          color: red;
          font-size: 0.8rem;
        }
      }
      > button#submit {
        margin-left: 2%;
        font-size: 1rem;
        padding: 0.5em;
        background-color: #f5f5f5;
        border: 1px solid gray;
        cursor: pointer;
        @media screen and (max-width: 1024px) {
          font-size: 0.9rem;
        }
        @media screen and (max-width: 600px) {
          font-size: 0.8rem;
        }
      }
    }
  }
`;

const Btn = styled.button`
  &.need {
    display: none;
    color: red;
  }
`;

const FileBox = styled.div`
  /* border: 2px solid red; */
  width: 95%;
  margin: 10px 0;
`;

function Writing() {
  const { id, accToken } = useSelector(selectUserInfo);
  const config = {
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${accToken}`,
    },
    withCredentials: true,
  };

  //?????? ????????? input
  const fileInput = useRef(null);

  //????????? ??????, ?????? ?????????
  const [textValues, setTextValues] = useState({
    title: null,
    content: null,
  });

  //???????????? ?????? ?????????
  const [selectedFile, setSelectedFile] = useState(null);

  //????????? ?????? ??????(?????? ??????)
  const handleSubmit = (e) => {
    e.preventDefault();
    const { title, content } = textValues;
    axios
      .post(
        `${process.env.REACT_APP_SERVER_DEV_URL}/info`,
        {
          type: 'Free',
          targetPoint: 0,
          title,
          content,
          file: '',
        },
        config,
      )
      .then((res) => {
        if (res.data.infoId) alert('?????? ?????????????????????.');
        setTextValues({
          title: '',
          content: '',
        });
      })
      .catch((err) => {
        alert('?????? ?????? ??????! ?????? ??????????????????.');
      });
  };

  //????????? ?????? ??????(?????? ?????????)
  const handleSubmitWithFile = (e) => {
    e.preventDefault();
    //loading indicator ????????????
    const fileName = `file/${v4().toString().replaceAll('-', '')}.${
      selectedFile.type.split('/')[1]
    }`;

    const params = {
      ACL: 'public-read-write',
      Body: selectedFile,
      Bucket: S3_BUCKET,
      Key: fileName,
    };

    myBucket.putObject(params, (err, data) => {
      //????????? ?????? ?????? ????????????.(?????? ????????? ??????)
      axios
        .post(
          `${process.env.REACT_APP_SERVER_DEV_URL}/info`,
          {
            type: 'Free',
            targetPoint: 0,
            ...textValues,
            file: fileName,
          },
          config,
        )
        .then((res) => {
          setTextValues({
            title: '',
            content: '',
          });
          setSelectedFile('');
          fileInput.current.value = '';
          if (res.data.infoId) alert('?????? ?????????????????????.');
        })
        .catch((err) => {
          deleteFile(fileName);
          alert('??????????????? ????????? ????????? ?????? ??? ???.');
        });
    });
  };

  //?????? ??????
  const deleteFile = (fileName) => {
    const params = {
      Bucket: S3_BUCKET,
      Key: fileName,
    };

    myBucket.deleteObject(params, (err, data) => {
      if (data) console.log('s3?????? ??????');
      if (err) console.log('s3?????? ?????? ??????');
    });
  };

  //?????? ??????
  const handleInputChange = (e) => {
    // const fileObj = e.target.files[0];
    // const ext = fileObj.name.split('.').pop();
    setSelectedFile(e.target.files[0]);
  };

  //?????? ?????? ??????
  const handleCancel = (e) => {
    e.preventDefault();
    fileInput.current.value = null;
    setSelectedFile(null);
  };

  return (
    <form>
      <textarea
        name="title"
        id="title"
        rows="1"
        cols="1"
        placeholder="??????"
        maxlength="100" //???????
        value={textValues.title}
        onChange={(e) =>
          setTextValues({ ...textValues, title: e.target.value })
        }
      ></textarea>
      <textarea
        name="content"
        id="content"
        placeholder="????????? ????????? ?????? ????????? ????????? ???????????????."
        value={textValues.content}
        onChange={(e) =>
          setTextValues({ ...textValues, content: e.target.value })
        }
      ></textarea>
      <FileBox className="file-upload">
        <input
          type="file"
          // accept="image/*, .pdf, .hwp, application/vnd.ms-excel, text/plain, text/html"
          onChange={handleInputChange}
          ref={fileInput}
        />
        <Btn className={!selectedFile && 'need'} onClick={handleCancel}>
          ?????? ??????
        </Btn>
      </FileBox>
      <div className="submit">
        <span
          className={
            textValues.title && textValues.content ? 'msg' : 'msg alert'
          }
        >
          ????????? ?????? ?????? ??????????????????.
        </span>
        <button
          id="submit"
          disabled={!textValues.title || !textValues.content}
          onClick={selectedFile ? handleSubmitWithFile : handleSubmit}
        >
          ?????? ??????
        </button>
      </div>
    </form>
  );
}

function FreeWriting() {
  const { isLogin } = useSelector(selectUserInfo);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLogin) return navigate('/main');
  }, []);

  return (
    <WritingContainer>
      <Writing />
    </WritingContainer>
  );
}

export default FreeWriting;
