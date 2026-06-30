// "use client";

// import { MissionFormState } from "./MissionForm";

// interface Props {
//     form: MissionFormState;
//     onChange: (
//         field: keyof MissionFormState,
//         value: string | boolean
//     ) => void;
// }

// const orderOptions = [1, 2, 3, 4, 5, 6];

// export default function MissionHomeLandingSection({ form, onChange }: Props) {
//     return (
//         <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
//             <div>
//                 <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
//                     Home Landing
//                 </h2>

//                 <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
//                     Activa esta misión para mostrarla en la sección principal
//                     de la landing y define su orden de aparición.
//                 </p>
//             </div>

//             <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
//                 <div>
//                     <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
//                         Mostrar en home
//                     </label>

//                     <button
//                         type="button"
//                         onClick={() =>
//                             onChange("show_home", !form.show_home)
//                         }
//                         className={`flex h-11 w-full items-center justify-between rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
//                             form.show_home
//                                 ? "border-brand-200 bg-brand-50 text-brand-700 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-400"
//                                 : "border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
//                         }`}
//                     >
//                         <span>
//                             {form.show_home
//                                 ? "Visible en landing"
//                                 : "No visible en landing"}
//                         </span>

//                         <span
//                             className={`h-5 w-10 rounded-full p-0.5 transition ${
//                                 form.show_home
//                                     ? "bg-brand-500"
//                                     : "bg-gray-300 dark:bg-gray-700"
//                             }`}
//                         >
//                             <span
//                                 className={`block h-4 w-4 rounded-full bg-white transition ${
//                                     form.show_home
//                                         ? "translate-x-5"
//                                         : "translate-x-0"
//                                 }`}
//                             />
//                         </span>
//                     </button>

//                     <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
//                         Si está activo, esta misión podrá aparecer en el home
//                         de la landing.
//                     </p>
//                 </div>

//                 <div>
//                     <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
//                         Orden en landing
//                     </label>

//                     <select
//                         value={form.home_order}
//                         onChange={(event) =>
//                             onChange("home_order", event.target.value)
//                         }
//                         disabled={!form.show_home}
//                         className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-brand-500 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 dark:border-gray-700 dark:text-white/90 dark:disabled:bg-gray-900 dark:disabled:text-gray-500"
//                     >
//                         <option value="">
//                             {form.show_home
//                                 ? "Selecciona un orden"
//                                 : "Activa mostrar en home"}
//                         </option>

//                         {orderOptions.map((order) => (
//                             <option key={order} value={order}>
//                                 Orden {order}
//                             </option>
//                         ))}
//                     </select>

//                     <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
//                         Puedes seleccionar una posición del 1 al 6 para ordenar
//                         las misiones destacadas en el home.
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// }