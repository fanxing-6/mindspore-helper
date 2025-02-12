import { useDevice } from "../../hooks/useDevice";

export default function MobileBlocker() {
  const { originalIsMobile } = useDevice();

  // 如果是移动设备，就显示阻止访问的界面
  if (originalIsMobile) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-black p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">仅支持桌面访问</h1>
          <p className="text-gray-600 dark:text-gray-400">
            为了获得最佳使用体验，请使用桌面设备访问本网站。
          </p>
        </div>
      </div>
    );
  }

  // 桌面设备则不显示任何内容
  return null;
}
