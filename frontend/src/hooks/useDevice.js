import { isMobile as originalIsMobile } from 'react-device-detect';

// 创建自定义 hook
export const useDevice = () => {
  return {
    // 强制返回 false，使所有设备都被识别为桌面设备
    isMobile: false,
    // 获取真实设备类型用于 MobileBlocker
    originalIsMobile: originalIsMobile
  };
};

// 为了兼容现有代码，提供一个默认的 isMobile 值
export const isMobile = false;
