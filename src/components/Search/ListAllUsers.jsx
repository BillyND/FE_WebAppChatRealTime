import { SpinnerLoading } from "@UI//SpinnerLoading";
import { useAuthUser } from "@utils/hooks/useAuthUser";
import { useScrollToBottom } from "@utils/hooks/useScrollBottom";
import { Flex } from "antd";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { getUser } from "../../services/api";
import { showPopupError } from "../../utils/utilities";
import ItemPreviewUser from "./ItemPreviewUser";
import { searchInputSubs } from "../../utils/globalStates/initGlobalState";
import { useSubscription } from "global-state-hook";

/**
 * Functional component to display a list of all users.
 * @param {object} props - Props for the ListAllUsers component.
 */
export default function ListAllUsers(props) {
  const {
    state: { results, next },
    setState: setDataSearchUser,
  } = useSubscription(searchInputSubs, ["keySearchUser", "resultsPreview"]);

  const [loadingFetch, setLoadingFetch] = useState(false);
  const { infoUser } = useAuthUser();
  const scrollContainerRef = useRef();
  const { isBottom } = useScrollToBottom(scrollContainerRef);

  useEffect(() => {
    if (isBottom) {
      handleGetUser(next);
    }
  }, [isBottom]);

  useEffect(() => {
    handleGetUser(next);
  }, []);

  /**
   * Function to fetch more users when scrolling to bottom.
   * @param {object} next - Next page details for user retrieval.
   */
  const handleGetUser = async (next) => {
    const { page, limit } = next || {};

    if (!next) {
      return;
    }

    setLoadingFetch(true);
    try {
      const resGetUser = await getUser(page, limit);
      const { next, results: resResult } = resGetUser;

      setDataSearchUser({
        next,
        results: [...results, ...resResult].filter(
          (user) => user?._id !== infoUser?._id
        ),
      });
    } catch (error) {
      showPopupError(error);
    } finally {
      setLoadingFetch(false);
    }
  };

  return (
    <Flex
      ref={scrollContainerRef}
      vertical
      gap={16}
      className={`wrap-list-all-user enable-scroll px-2 ${next && "pb-3"}`}
    >
      {results.map((user) => (
        <Fragment key={user?._id}>
          <ItemPreviewUser user={user} />
        </Fragment>
      ))}
      <span>
        <hr className="gray ml-5" />
      </span>
      {next && <SpinnerLoading style={{ opacity: loadingFetch ? "1" : "0" }} />}
    </Flex>
  );
}
