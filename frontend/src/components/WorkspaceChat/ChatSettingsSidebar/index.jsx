import React, { useEffect, useRef, useState } from "react";
import { Plus, List } from "@phosphor-icons/react";

import useUser from "@/hooks/useUser";

import { Link } from "react-router-dom";
import paths from "@/utils/paths";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useMatch } from "react-router-dom";

export default function ChatSettingsSidebar() {
  const { t } = useTranslation();
  const { slug } = useParams();
  return (
    <>
      <div className="w-full h-full bg-theme-bg-container">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-lg font-semibold">{slug}</h2>
        </div>
      </div>
    </>
  );
}
