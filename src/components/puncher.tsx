import { projects } from "../db/schema";

interface PuncherProps {
  project: typeof projects.$inferSelect;
  action: "start" | "end";
}
export const Puncher = ({ project, action }: PuncherProps) => {
  return (
    <div
      id={`puncher_${project.id}`}
      class={`w-full flex flex-col gap-4 p-8 justify-between items-center border rounded-md ${
        action === "end" && "bg-neutral-700"
      }`}>
      <div class="flex items-center justify-between gap-2">
        <p class="font-bold text-xl">{project.name}</p>
        <button
          type="button"
          hx-trigger="click"
          hx-confirm="Are you sure? These will also delete related sessions."
          hx-delete={`/project/deleteProject/${project.id}`}
          hx-target={`#puncher_${project.id}`}
          hx-swap="delete"
          class="w-fit text-sm px-4 py-2 border border-red-600 rounded-md font-bold text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300">
          <svg
            viewbox="0 0 32 32"
            width="16"
            height="16"
            stroke="currentColor"
            fill="currentColor">
            <path
              d="M4 8L6.7 8 28 8"
              _id="63ce595bda5b7d1fa85644ef"
              _parent="63ce595bda5b7d1fa85644ee"
              fill="none"
              stroke-width="2.65625"
              stroke-linejoin="round"
              stroke-linecap="round"
            />
            <path
              d="M25.3 8v18.7a2.7 2.7 0 0 1-2.6 2.6H9.3a2.7 2.7 0 0 1-2.6-2.6V8m4 0V5.3a2.7 2.7 0 0 1 2.6-2.6h5.4a2.7 2.7 0 0 1 2.6 2.6v2.7"
              _id="63ce595bda5b7d1fa85644f0"
              _parent="63ce595bda5b7d1fa85644ee"
              fill="none"
              stroke-width="2.65625"
              stroke-linejoin="round"
              stroke-linecap="round"
            />
            <path
              d="M13.3 14.7L13.3 22.7"
              _id="63ce595bda5b7d1fa85644f1"
              _parent="63ce595bda5b7d1fa85644ee"
              fill="none"
              stroke-width="2.65625"
              stroke-linejoin="round"
              stroke-linecap="round"
            />
            <path
              d="M18.7 14.7L18.7 22.7"
              _id="63ce595bda5b7d1fa85644f2"
              _parent="63ce595bda5b7d1fa85644ee"
              fill="none"
              stroke-width="2.65625"
              stroke-linejoin="round"
              stroke-linecap="round"
            />
            <title>Trash</title>
          </svg>
        </button>
      </div>
      <button
        type="button"
        hx-trigger="click"
        hx-patch={`/punch/${project.id}`}
        hx-target={`#puncher_${project.id}`}
        hx-swap="outerHTML"
        class={`rounded-md px-4 py-2 w-full h-fit ${
          action === "start" ? "bg-emerald-600" : "bg-red-600"
        }`}>
        {action}
      </button>
    </div>
  );
};
