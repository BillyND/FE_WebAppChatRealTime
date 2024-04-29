import { SpinnerLoading } from "@UI/SpinnerLoading";
import { getUser } from "@services/api";
import { searchInputSubs } from "@utils/globalStates/initGlobalState";
import { useAuthUser } from "@utils/hooks/useAuthUser";
import { useScrollToBottom } from "@utils/hooks/useScrollBottom";
import { showPopupError } from "@utils/utilities";
import { Flex } from "antd";
import { useSubscription } from "global-state-hook";
import React, { Fragment, useEffect, useRef, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import ItemPreviewUser from "./ItemPreviewUser";

/**
 * Functional component to display a list of all users.
 * @param {object} props - Props for the ListAllUsers component.
 */
export default function ListAllUsers(props) {
  const {
    state: { results, next },
    setState: setDataSearchUser,
  } = useSubscription(searchInputSubs, ["keySearchUser", "results"]);

  const [loadingFetch, setLoadingFetch] = useState(false);
  const { infoUser } = useAuthUser();
  const scrollContainerRef = useRef();
  const { isBottom } = useScrollToBottom(scrollContainerRef);

  useEffect(() => {
    if (isBottom && next) {
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
  const handleGetUser = async (currentNext) => {
    const { page, limit } = currentNext || {};

    if (!currentNext) return;

    setLoadingFetch(true);
    try {
      const resGetUser = await getUser(page, limit);
      const { next, results: resResult } = resGetUser;

      const finalResultUser = (
        currentNext ? [...results, ...resResult] : [...resResult, ...results]
      ).filter((user) => user?._id !== infoUser?._id);

      setDataSearchUser({
        next: currentNext ? next : currentNext,
        results: finalResultUser,
      });
    } catch (error) {
      showPopupError(error);
    } finally {
      setLoadingFetch(false);
    }
  };

  return (
    <PerfectScrollbar
      containerRef={(el) => (scrollContainerRef.current = el)}
      className={`wrap-list-all-user px-2 ${next && "pb-3"}`}
      id="list-all-user"
    >
      <Flex vertical gap={16}>
        {results.map((user) => (
          <Fragment key={user?.email}>
            <ItemPreviewUser user={user} />
          </Fragment>
        ))}
        <span>
          <hr className="gray ml-5" />
        </span>
        {next && (
          <SpinnerLoading style={{ opacity: loadingFetch ? "1" : "0" }} />
        )}
      </Flex>
    </PerfectScrollbar>
  );
}
