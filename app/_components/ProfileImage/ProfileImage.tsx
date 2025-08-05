"use client";

import Image from "next/image";
import {ChangeEvent, Dispatch, SetStateAction, useState} from "react";

interface IUploadImage{
  setPreviewImg: Dispatch<SetStateAction<FileList | undefined>>
}

const UploadImage = ({ setPreviewImg }:IUploadImage) => {
  /**
   * 이벤트 타겟이 된 파일을 state에 저장한다
   * @param event: ChangeEvent<HTMLInputElement>
   * @return undefined    
   * */
  const fileHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files;

    if (file && file.length > 0) {
      setPreviewImg(file);
    }
  }

  return (
      <input type="file" onChange={(e) => fileHandler(e)} />
  )
}



export const ProfileImage = ()=>{
  const [previewImg, setPreviewImg] = useState<FileList>();

  /**
   * 이미지를 저장해서 formData에 넣어서 보내는 역할
   * @param event: ChangeEvent<HTMLInputElement>
   * @return undefined
   * */
  const saveHandler = async () => {
    if (!previewImg) {
      return
    }

    const formData = new FormData();
    formData.append("img", previewImg[0]);

    const result = await fetch("/api/user", {
      method: "POST",
      body: formData,
    }).then((res) => res.json());

    if (result.message == "OK") {
      alert("이미지가 저장되었습니다.");
    }
  }



  return (
      <main>
        <div>
          <form>
            <UploadImage setPreviewImg={setPreviewImg}/>
            {previewImg && (
                <Image
                    src={URL.createObjectURL(previewImg[0])}
                    alt="이미지 미리보기"
                    width={100}
                    height={100}
                />
            )}
            <button
                type="button"
                onClick={() => saveHandler()}
            >
              저장하기
            </button>
          </form>
        </div>
      </main>
  );
}