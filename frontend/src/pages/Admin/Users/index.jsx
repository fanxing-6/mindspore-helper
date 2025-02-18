import { useEffect, useState } from "react";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "@/hooks/useDevice";
import * as Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { UserPlus } from "@phosphor-icons/react";
import Admin from "@/models/admin";
import UserRow from "./UserRow";
import useUser from "@/hooks/useUser";
import NewUserModal from "./NewUserModal";
import { useModal } from "@/hooks/useModal";
import ModalWrapper from "@/components/ModalWrapper";
import CTAButton from "@/components/lib/CTAButton";

export default function AdminUsers() {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <div className="w-screen h-screen overflow-hidden bg-theme-bg-container flex">
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-theme-bg-secondary w-full h-full overflow-y-scroll p-4 md:p-0"
      >
        <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] md:py-6 py-16">
          <div className="w-full flex flex-col gap-y-1 pb-6 border-white/10 border-b-2">
            <div className="items-center flex gap-x-4">
              <p className="text-lg leading-6 font-bold text-theme-text-primary">
                {/* Users */}
                用户
              </p>
            </div>
            <p className="text-xs leading-[18px] font-base text-theme-text-secondary">
              {/* These are all the accounts which have an account on this instance.
              Removing an account will instantly remove their access to this
              instance. */}
              这些是所有在实例上有账户的账户。
              删除一个账户将立即删除他们的访问权限。
            </p>
          </div>
          <div className="w-full justify-end flex">
            <CTAButton
              onClick={openModal}
              className="mt-3 mr-0 mb-4 md:-mb-6 z-10"
            >
              <UserPlus className="h-4 w-4" weight="bold" /> 添加用户
            </CTAButton>
          </div>
          <div className="overflow-x-auto">
            <UsersContainer />
          </div>
        </div>
        <ModalWrapper isOpen={isOpen}>
          <NewUserModal closeModal={closeModal} />
        </ModalWrapper>
      </div>
    </div>
  );
}

function UsersContainer() {
  const { user: currUser } = useUser();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      const _users = await Admin.users();
      setUsers(_users);
      setLoading(false);
    }
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <Skeleton.default
        height="80vh"
        width="100%"
        highlightColor="var(--theme-bg-primary)"
        baseColor="var(--theme-bg-secondary)"
        count={1}
        className="w-full p-4 rounded-b-2xl rounded-tr-2xl rounded-tl-sm mt-8"
        containerClassName="flex w-full"
      />
    );
  }

  return (
    <table className="w-full text-sm text-left rounded-lg min-w-[640px] border-spacing-0">
      <thead className="text-theme-text-secondary text-xs leading-[18px] font-bold uppercase border-white/10 border-b">
        <tr>
          <th scope="col" className="px-6 py-3 rounded-tl-lg">
            {/* Username */}
            用户名
          </th>
          <th scope="col" className="px-6 py-3">
            {/* Role */}
            角色
          </th>
          <th scope="col" className="px-6 py-3">
            {/* Date Added */}
            添加日期
          </th>
          <th scope="col" className="px-6 py-3 rounded-tr-lg">
            {/* Delete */}
            删除
          </th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <UserRow key={user.id} currUser={currUser} user={user} />
        ))}
      </tbody>
    </table>
  );
}

const ROLE_HINT = {
  default: [
    "只能发送与他们添加到工作区相关的聊天。",
    "无法修改任何设置。",
  ],
  manager: [
    "可以查看、创建和删除任何工作区，并修改工作区特定的设置。",
    "可以创建、更新和邀请新用户到实例。",
    "无法修改LLM、向量数据库、嵌入或连接。",
  ],
  admin: [
    "最高用户级别权限。",
    "可以查看和执行系统中的所有操作。",
  ],
};

export function RoleHintDisplay({ role }) {
  return (
    <div className="flex flex-col gap-y-1 py-1 pb-4">
      <p className="text-sm font-medium text-theme-text-primary">权限</p>
      <ul className="flex flex-col gap-y-1 list-disc px-4">
        {ROLE_HINT[role ?? "default"].map((hints, i) => {
          return (
            <li key={i} className="text-xs text-theme-text-secondary">
              {hints}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function MessageLimitInput({ enabled, limit, updateState, role }) {
  if (role === "admin") return null;
  return (
    <div className="mt-4 mb-8">
      <div className="flex flex-col gap-y-1">
        <div className="flex items-center gap-x-2">
          <h2 className="text-base leading-6 font-bold text-white">
            限制每天流量
          </h2>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => {
                updateState((prev) => ({
                  ...prev,
                  enabled: e.target.checked,
                }));
              }}
              className="peer sr-only"
            />
            <div className="pointer-events-none peer h-6 w-11 rounded-full bg-[#CFCFD0] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:shadow-xl after:border-none after:bg-white after:box-shadow-md after:transition-all after:content-[''] peer-checked:bg-[#32D583] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-transparent"></div>
          </label>
        </div>
        <p className="text-xs leading-[18px] font-base text-white/60">
          限制用户在24小时内成功查询或聊天的数量。
        </p>
      </div>
      {enabled && (
        <div className="mt-4">
          <label className="text-white text-sm font-semibold block mb-4">
            每天限制流量
          </label>
          <div className="relative mt-2">
            <input
              type="number"
              onScroll={(e) => e.target.blur()}
              onChange={(e) => {
                updateState({
                  enabled: true,
                  limit: Number(e?.target?.value || 0),
                });
              }}
              value={limit}
              min={1}
              className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            />
          </div>
        </div>
      )}
    </div>
  );
}
