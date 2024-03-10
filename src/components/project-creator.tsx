export const ProjectCreator = () => {
  return (
    <div class="flex gap-4 p-8 border rounded-xl">
      <input
        type="text"
        name="new_project"
        placeholder="Enter project name..."
        class="px-4 py-2 rounded-xl text-black"
      />
      <button
        type="button"
        hx-trigger="click"
        hx-post="/createProject"
        hx-include="[name='new_project']"
        hx-target="#punchers"
        hx-swap="beforeend"
        class="px-4 py-2 rounded-xl bg-white text-black">
        Create
      </button>
    </div>
  );
};
