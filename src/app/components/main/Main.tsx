import React, {useState, useRef} from 'react';
import imageCompression from "browser-image-compression";

const Main = () => {

    const [profileImage, setProfileImage] = useState("");

    const fileInputRef = useRef<HTMLInputElement>(null); //## 파일 업로드 input ref 생성

    /**
     * 프로필 이미지 파일 체크
     * -----------------------------------------------------------------------------------------------------------------
     * @param e : Object Data
     */
    const getProfileFileName = (e: any) => {
        let reader: FileReader = new FileReader();

        if (e.files[0]) {
            reader.onload = function (readerEvent: any) {
                setImageResize(readerEvent, 500, function (response: any) {
                    //## 프로필 이미지 변경
                    setProfileImage(response);
                });
            };
            reader.readAsDataURL(e.files[0]);
        }
    };

    /**
     * Image Size 조절하기
     * ---------------------------------------------------------------------------------------------------------------------
     *
     * @param file : File
     * @param maxWidth : resize width value
     * @param callback
     */
    const setImageResize = (file: any, maxWidth: number, callback: any) => {
        let image: HTMLImageElement = new Image();

        image.onload = function () {
            let canvas = document.createElement("canvas");
            let max_size = maxWidth;
            let width = image.width;
            let height = image.height;

            if (width > height) {
                if (width > max_size) {
                    height *= max_size / width;
                    width = max_size;
                }
            } else {
                if (height > max_size) {
                    width *= max_size / height;
                    height = max_size;
                }
            }
            canvas.width = width;
            canvas.height = height;
            canvas.getContext("2d")?.drawImage(image, 0, 0, width, height);
            if (callback) {
                callback(canvas.toDataURL("image/png"));
            }
        };
        image.src = file.target?.result;
    };

    /**
     * File Size 조절하기
     * ---------------------------------------------------------------------------------------------------------------------
     *
     * @param file : File
     */
    const setFileResize = async (file: File) => {
        const options = {
            maxWidthOrHeight: 500
        };

        const resizedImage: File = await imageCompression(file, options);

        file = new File([resizedImage], file.name, {lastModified: Date.now()});

        return file;
    };

    /**
     * 프로필 사진 파일 업로드 Api
     * -----------------------------------------------------------------------------------------------------------------
     */
    const changeProfileApi = async () => {
        const formData: FormData = new FormData();
        if (profileImage) {
            let file = null;
            const res: Response = await fetch(profileImage);
            const blob: Blob = await res.blob();

            let avatarFile: File = new File([blob], "avatar", { type: "image/png" });
            if (avatarFile) {
                file = await setFileResize(avatarFile);
            }
            // @ts-ignore
            formData.append("avatar", file);
            formData.append("image_type", "avatar");
        }

        // await Api.changeProfile(formData)
        //     .then((response: any) => {
        //         if (response.status === 200) {
        //             let msg = '대표 사진을 수정하였습니다.';
        //             alert(msg);
        //         }
        //     })
        //     .catch((err: any) => {
        //         console.log(err);
        //     });
    };

    return (
        <>
            <input
                type="file"
                id="profile"
                // style={{visibility: "hidden"}}
                ref={fileInputRef}
                accept="image/png, image/jpeg, image/jpg"
                onChange={(e) => getProfileFileName(e.target)}
            />
            {
                profileImage &&
                <img src={profileImage} alt='upload-image'/>
            }
        </>
    );
};

export default Main;