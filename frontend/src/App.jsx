// function App() {
//   return (
//     <div className="min-h-screen bg-slate-50">
//       <div className="flex min-h-screen items-center justify-center px-6">
//         <div className="text-center">
//           <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-2xl font-bold text-white shadow-lg">
//             C
//           </div>

//           <h1 className="text-4xl font-bold tracking-tight text-slate-900">
//             Coworking Space
//           </h1>

//           <p className="mt-3 text-slate-500">
//             Find your perfect workspace.
//           </p>

//           <button className="mt-8 rounded-xl bg-slate-900 px-6 py-3 font-medium text-white shadow-sm transition hover:bg-slate-700">
//             Explore Spaces
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;

import AppRoutes from "./routes/AppRoutes";

function App() {
  return <AppRoutes />;
}

export default App;