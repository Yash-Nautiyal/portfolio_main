import Link from "next/link";
import { CaseWindow } from "@/components/project/case-window";
import s from "@/components/project/case-study.module.css";

export default function ProjectNotFound() {
  return (
    <CaseWindow path="yash_nautiyal / lib / builds / ?">
      <div className={`${s.card} ${s.status}`}>
        <p className={s.term}>
          <b>Error:</b> No build found for this route.
        </p>
        <h1>Project not found</h1>
        <p>The requested project does not exist or has been removed.</p>
        <Link href="/" className={s.btnMain} style={{ flex: "none", padding: "0 26px" }}>
          Back to the phone
        </Link>
      </div>
    </CaseWindow>
  );
}
