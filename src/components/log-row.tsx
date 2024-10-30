import { logs } from "../db/schema";
import { getDuration } from "../utils";

interface LogProps {
  log: typeof logs.$inferSelect;
  editing: boolean;
}

export const LogRow = ({ log, editing }: LogProps) => {
  return (
    <tr
      id={`log_${log.id}`}
      class="text-center table-row">
      <td class="py-4">{getDuration(log)}</td>
      <td class="py-4">{log.projectId}</td>
      <td class="py-4">
        {!editing ? (
          log.start?.toLocaleString()
        ) : (
          <input
            name={`start_${log.id}`}
            type="datetime-local"
            value={
              (log.start &&
                new Date(
                  log.start?.getTime() +
                    new Date().getTimezoneOffset() * -60 * 1000
                )
                  .toISOString()
                  .slice(0, 19)) ||
              ""
            }
            class="bg-neutral-800 text-white"
          />
        )}
      </td>
      <td class="py-4">
        {!editing ? (
          log.end?.toLocaleString()
        ) : (
          <input
            name={`end_${log.id}`}
            type="datetime-local"
            value={
              (log.end &&
                new Date(
                  log.end?.getTime() +
                    new Date().getTimezoneOffset() * -60 * 1000
                )
                  .toISOString()
                  .slice(0, 19)) ||
              ""
            }
            class="bg-neutral-800"
          />
        )}
      </td>
      <td class="flex gap-2 text-red-600 items-center justify-center">
        <button
          type="button"
          hx-trigger="click"
          hx-confirm="Are you sure?"
          hx-delete={`/log/deleteLog/${log.id}`}
          hx-target={`#log_${log.id}`}
          hx-swap="delete"
          class="p-4">
          <div class="w-full h-full">
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
          </div>
        </button>

        {editing ? (
          <button
            type="button"
            hx-trigger="click"
            hx-confirm="Confirm edits?"
            hx-patch={`/log/confirmLogEdit/${log.id}`}
            hx-include={`[name='start_${log.id}'], [name='end_${log.id}']`}
            hx-target={`#log_${log.id}`}
            hx-swap="outerHTML">
            Done
          </button>
        ) : (
          <button
            type="button"
            hx-trigger="click"
            hx-patch={`/log/editLog/${log.id}`}
            hx-target={`#log_${log.id}`}
            class="p-4"
            hx-swap="outerHTML">
            Edit
          </button>
        )}
      </td>
    </tr>
  );
};
