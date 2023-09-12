import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import FloatingNavButton from "@/components/FloatingNavButton";
import MemoFilter from "@/components/MemoFilter";
import MemoList from "@/components/MemoList";
import UserAvatar from "@/components/UserAvatar";
import useLoading from "@/hooks/useLoading";
import { useUserStore } from "@/store/module";
import { useUserV1Store } from "@/store/v1";
import { User } from "@/types/proto/api/v2/user_service_pb";
import { useTranslate } from "@/utils/i18n";

const UserProfile = () => {
  const t = useTranslate();
  const userStore = useUserStore();
  const userV1Store = useUserV1Store();
  const loadingState = useLoading();
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const currentUsername = userStore.getCurrentUsername();
    userV1Store
      .getOrFetchUserByUsername(currentUsername)
      .then((user) => {
        setUser(user);
        loadingState.setFinish();
      })
      .catch((error) => {
        console.error(error);
        toast.error(t("message.user-not-found"));
      });
  }, [userStore.getCurrentUsername()]);

  return (
    <>
      <section className="relative top-0 w-full min-h-full overflow-x-hidden bg-zinc-100 dark:bg-zinc-800">
        <div className="relative w-full min-h-full mx-auto flex flex-col justify-start items-center">
          {!loadingState.isLoading &&
            (user ? (
              <>
                <main className="relative flex-grow max-w-2xl w-full min-h-full flex flex-col justify-start items-start px-4">
                  <div className="w-full flex flex-row justify-start items-start">
                    <div className="flex-grow shrink w-full">
                      <div className="w-full flex flex-col justify-start items-center py-8">
                        <UserAvatar className="!w-20 h-auto mb-4 drop-shadow" avatarUrl={user?.avatarUrl} />
                        <div>
                          <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">{user?.nickname}</p>
                        </div>
                      </div>
                      <div className="w-full h-auto flex flex-col justify-start items-start bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                        <MemoFilter />
                      </div>
                      <MemoList />
                    </div>
                  </div>
                </main>
              </>
            ) : (
              <>
                <p>Not found</p>
              </>
            ))}
        </div>
      </section>

      <FloatingNavButton />
    </>
  );
};

export default UserProfile;
