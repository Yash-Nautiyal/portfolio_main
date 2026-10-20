import { CaseWindow } from "@/components/project/case-window";
import s from "@/components/project/case-study.module.css";

export default function ProjectLoading() {
  return (
    <CaseWindow path="yash_nautiyal / lib / builds">
      <div className={`${s.card} ${s.status}`} role="status">
        <p className={s.term}>
          <b>$</b> flutter run --case-study <span className={s.cursor} aria-hidden />
        </p>
        <p>Loading project details…</p>
      </div>
    </CaseWindow>
  );
}
