import { METRIC_ITEM_STATS } from "@/constants/metricsSummaryItems";
import { profileCompletionSummary } from "@/lib/interface/profile.interface";

export default function MetricsSummary({
  profileSummary
}: {
  profileSummary: profileCompletionSummary;
}) {

  return (
    <div className="grid grid-cols-2 divide-y divide-slate-100 sm:grid-cols-4 sm:divide-x sm:divide-y-0">
      {METRIC_ITEM_STATS.map((item) => {
        const Icon = item.icon;

        const value =
          item.key === "completionPercentage"
            ? `${profileSummary[item.key]}%`
            : profileSummary[item.key];

        return (
          <div
            key={item.key}
            className="flex flex-col flex-wrap items-center justify-center p-3 text-center"
          >
            <span className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {value}
            </span>

            <span className="mt-1 text-xs font-medium text-slate-500">
              {item.label}
            </span>

            <Icon className={`mt-2 h-4 w-4 ${item.color}`} />
          </div>
        );
      })}
    </div>
  );
}
