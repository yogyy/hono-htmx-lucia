export const ProjectCreator = () => {
  return (
    <div class="flex gap-4 p-8 border rounded-md">
      <input
        type="text"
        name="new_project"
        placeholder="Enter project name..."
        class="px-4 py-2 rounded-md text-black"
      />
      <button
        type="button"
        hx-trigger="click"
        hx-post="/project/createProject"
        hx-include="[name='new_project']"
        hx-target="#punchers"
        hx-swap="beforeend"
        class="px-4 py-2 rounded-md bg-white text-black">
        Create
      </button>
    </div>
  );
};
