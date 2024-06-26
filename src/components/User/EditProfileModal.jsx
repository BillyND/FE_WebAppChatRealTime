import BaseModal from "@UI/BaseModal";
import { SpinnerLoading } from "@UI/SpinnerLoading";
import { UserThumbnail } from "@UI/UserThumbnail";
import { LockOutlined } from "@ant-design/icons";
import { readFileAsDataURL, resizeImage } from "@utils/handleImages";
import { useAuthUser } from "@utils/hooks/useAuthUser";
import { useStyleApp } from "@utils/hooks/useStyleApp";
import { Flex, message } from "antd";
import { useSubscription } from "global-state-hook";
import React, { useRef, useState } from "react";
import SeparatingLine from "../../UI/SeparatingLine";
import { saveProfileUser } from "../../services/api";
import { TYPE_STYLE_APP } from "../../utils/constant";
import { listPostSubs } from "../../utils/globalStates/initGlobalState";
import { showPopupError } from "../../utils/utilities";
import { WrapEditProfile } from "./UserScreenStyled";

const InputInfoUser = (props) => {
  const { label, value, setValue } = props;

  return (
    <Flex vertical className="width-100-per">
      <b>{label}</b>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="input-about-of-user"
      />
    </Flex>
  );
};

function EditProfileModal() {
  const { login } = useAuthUser();
  const {
    state: { currentUser },
  } = useSubscription(listPostSubs, ["currentUser"]);
  const {
    styleApp: { type: typeStyle },
  } = useStyleApp();
  const { avaUrl, username, email, showEditProfile, about } = currentUser || {};
  const [infoUser, setInfoUser] = useState({
    username: username,
    about: about,
    loadingUpdate: false,
    avaUrl: avaUrl,
    loadingParseImage: false,
  });

  const [newAvaUrl, setNewAvaUrl] = useState(avaUrl);
  const refInputImage = useRef(null);

  const handleClosePreview = () => {
    listPostSubs.updateState({
      currentUser: { ...currentUser, showEditProfile: false },
    });
  };

  const handleCancelSave = () => {
    handleClosePreview();
    setInfoUser({ username: username, about: about });
    setNewAvaUrl(avaUrl);

    if (refInputImage.current) {
      refInputImage.current.value = null;
    }
  };

  const handleSaveProfile = async () => {
    try {
      // Start updating loading state
      setInfoUser((prevInfoUser) => ({
        ...prevInfoUser,
        loadingUpdate: true,
      }));

      // Save the new user profile information
      const resSaveProfile = await saveProfileUser({
        ...infoUser,
        avaUrl: newAvaUrl,
      });

      if (!resSaveProfile?._id) {
        showPopupError();
        return;
      }

      // Update the logged-in user information and update display state
      login({ infoUser: { ...infoUser, ...resSaveProfile } });

      // Update post states
      listPostSubs.updateState({
        currentUser: { ...resSaveProfile, showEditProfile: false },
        listPostByUser: listPostSubs.state.listPostByUser.map((post) => {
          return {
            ...post,
            avaUrl: resSaveProfile.avaUrl,
            username: resSaveProfile.username,
          };
        }),
        listPost: listPostSubs.state.listPost.map((post) => {
          if (post.userId === currentUser._id) {
            return {
              ...post,
              avaUrl: resSaveProfile.avaUrl,
              username: resSaveProfile.username,
            };
          }
          return post;
        }),
      });

      // Update the new avatar URL
      setNewAvaUrl(resSaveProfile?.avaUrl || avaUrl);
    } catch (error) {
      showPopupError(error);
      console.error("===> Error handleSaveProfile:", error);
    } finally {
      // Finish updating loading state
      setInfoUser((prevInfoUser) => ({
        ...prevInfoUser,
        loadingUpdate: false,
      }));
    }
  };

  const handleFileChange = async (event) => {
    setInfoUser({ ...infoUser, loadingParseImage: true });

    const selectedFile = event.target.files[0];

    if (!selectedFile) {
      setInfoUser({ ...infoUser, loadingParseImage: false });
      return;
    }

    if (!selectedFile.type.startsWith("image")) {
      message.error("Please select an image!");
      setInfoUser({
        ...infoUser,
        avaUrl: avaUrl,
      });
      setInfoUser({ ...infoUser, loadingParseImage: false });
      return;
    }

    try {
      const resizedFile = await resizeImage(selectedFile);

      const dataURL = await readFileAsDataURL(resizedFile);

      setNewAvaUrl(dataURL);
    } catch (error) {
      console.error(error);
      showPopupError("Image is incorrect, please choose another image!");
    } finally {
      setInfoUser({ ...infoUser, loadingParseImage: false });
    }
  };

  return (
    <BaseModal
      className="modal-delete-post"
      open={showEditProfile}
      onCancel={!infoUser.loadingUpdate ? handleCancelSave : undefined}
      onOk={() => {}}
      hiddenClose={true}
      footer={<></>}
      width={400}
    >
      <WrapEditProfile is-dark={typeStyle === TYPE_STYLE_APP.DARK}>
        <Flex vertical className="pt-4 pb-4 px-2" gap={12}>
          <Flex justify="space-between" gap={16} className="width-100-per">
            <Flex vertical gap={12} className="width-100-per">
              <Flex vertical>
                <b>Email</b>
                <Flex
                  align="center"
                  justify="start"
                  gap={4}
                  style={{ cursor: "no-drop" }}
                >
                  <LockOutlined />
                  <span>{email}</span>
                </Flex>
              </Flex>
              <SeparatingLine height={1} />
            </Flex>

            <label
              htmlFor="fileInputAvaUrl"
              className="press-active label-input-avatar"
            >
              <UserThumbnail avaUrl={newAvaUrl} size={55} />
            </label>

            <input
              ref={refInputImage}
              type="file"
              accept="image/*"
              id="fileInputAvaUrl"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </Flex>

          <InputInfoUser
            label="User name"
            value={infoUser.username}
            setValue={(value) => setInfoUser({ ...infoUser, username: value })}
          />
          <SeparatingLine height={1} />

          <Flex justify="space-between" gap={16}>
            <InputInfoUser
              label="Story"
              value={infoUser.about}
              setValue={(value) => setInfoUser({ ...infoUser, about: value })}
            />
          </Flex>
          <Flex
            align="center"
            justify="center"
            className={`btn-done-edit press-active ${
              infoUser.loadingUpdate ? "loading" : ""
            }`}
            onClick={handleSaveProfile}
          >
            Done
            {infoUser.loadingUpdate && (
              <SpinnerLoading className="spinner-update-info" />
            )}
          </Flex>
        </Flex>
      </WrapEditProfile>
    </BaseModal>
  );
}

export default EditProfileModal;
