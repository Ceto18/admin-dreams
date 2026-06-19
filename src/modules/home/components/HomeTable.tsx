// "use client";

// import DataTable, {
//     DataTableColumn,
// } from "@/shared/components/table/DataTable";

// import Badge from "@/shared/components/ui/badge/Badge";
// import { Home } from "../types";

// interface Props {
//     data: Home[];
//     loading?: boolean;

//     onView?: (home: Home) => void;
//     onEdit?: (home: Home) => void;

//     showView?: boolean;
//     showEdit?: boolean;
// }

// export default function HomeTable({
//     data,
//     loading = false,
//     onView,
//     onEdit,
//     showView = false,
//     showEdit = true,
// }: Props) {
//     const columns: DataTableColumn<Home>[] = [
//         {
//             key: "section",
//             header: "Sección",
//             render: () => (
//                 <div>
//                     <p className="font-medium text-gray-800 dark:text-white/90">
//                         Hero principal
//                     </p>

//                     <p className="text-xs text-gray-500 dark:text-gray-400">
//                         Portada inicial de Dreams
//                     </p>
//                 </div>
//             ),
//         },
//         {
//             key: "title",
//             header: "Título",
//             render: (home) => (
//                 <div>
//                     <p className="font-medium text-gray-800 dark:text-white/90">
//                         {home.hero?.title || "-"}
//                     </p>

//                     <p className="text-xs text-brand-500">
//                         {home.hero?.highlight_text || "Sin texto destacado"}
//                     </p>
//                 </div>
//             ),
//         },
//         {
//             key: "description",
//             header: "Descripción",
//             render: (home) => (
//                 <p className="max-w-md line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
//                     {home.hero?.description || "-"}
//                 </p>
//             ),
//         },
//         {
//             key: "stats",
//             header: "Contadores",
//             render: (home) => (
//                 <div className="flex flex-wrap gap-2">
//                     <Badge size="sm" color="info">
//                         {home.hero?.destinations_count ?? 0} destinos
//                     </Badge>

//                     <Badge size="sm" color="success">
//                         {home.hero?.travelers_count ?? 0} viajeros
//                     </Badge>

//                     <Badge size="sm" color="warning">
//                         {home.hero?.experiences_count ?? 0} experiencias
//                     </Badge>

//                     <Badge size="sm" color="primary">
//                         {home.hero?.continents_count ?? 0} continentes
//                     </Badge>
//                 </div>
//             ),
//         },
//         {
//             key: "images",
//             header: "Imágenes",
//             render: (home) => (
//                 <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                     {home.hero?.images?.length ?? 0} imágenes
//                 </span>
//             ),
//         },
//     ];

//     return (
//         <DataTable
//             data={data}
//             columns={columns}
//             loading={loading}
//             emptyMessage="No hay información del home registrada."
//             getRowKey={() => "home-hero"}
//             onView={onView}
//             onEdit={onEdit}
//             showView={showView}
//             showEdit={showEdit}
//             showDelete={false}
//         />
//     );
// }