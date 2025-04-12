// // components/dashboard/ClientPerformance.jsx
// import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
// import { moneyColors } from "@/style/theme";

// export default function ClientPerformance() {
//   // Client performance data - in a real application, this would likely come from props or a data fetching hook
//   const clientSegments = [
//     { 
//       segment: "Premium", 
//       count: 12, 
//       avgAssets: "$456,000", 
//       goalCompletion: "92%", 
//       revenue: "$18,240" 
//     },
//     { 
//       segment: "Standard", 
//       count: 24, 
//       avgAssets: "$125,000", 
//       goalCompletion: "78%", 
//       revenue: "$9,600" 
//     },
//     { 
//       segment: "Starter", 
//       count: 12, 
//       avgAssets: "$42,000", 
//       goalCompletion: "64%", 
//       revenue: "$4,560" 
//     },
//     { 
//       segment: "Total", 
//       count: 48, 
//       avgAssets: "$187,250", 
//       goalCompletion: "78%", 
//       revenue: "$32,400",
//       isTotal: true
//     }
//   ];

//   return (
//     <Card className="mt-6 overflow-hidden border-none shadow-md">
//       <div style={{ background: moneyColors.gradient.primary }} className="h-1"></div>
//       <CardHeader>
//         <CardTitle className="flex items-center">
//           <div className="w-2 h-6 rounded-md mr-2" style={{ backgroundColor: moneyColors.money.primary }}></div>
//           Client Performance Overview
//         </CardTitle>
//         <CardDescription>Key metrics for your client portfolio</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr style={{ borderBottom: `1px solid ${moneyColors.bg.hover}` }}>
//                 <th className="text-left p-2 text-slate-500">Client Segment</th>
//                 <th className="text-right p-2 text-slate-500">Count</th>
//                 <th className="text-right p-2 text-slate-500">Avg. Assets</th>
//                 <th className="text-right p-2 text-slate-500">Goal Completion</th>
//                 <th className="text-right p-2 text-slate-500">Revenue</th>
//               </tr>
//             </thead>
//             <tbody>
//               {clientSegments.map((segment) => (
//                 <tr 
//                   key={segment.segment} 
//                   style={{ 
//                     borderBottom: segment.isTotal ? "none" : `1px solid ${moneyColors.bg.hover}`,
//                     backgroundColor: segment.isTotal ? moneyColors.bg.highlight : "transparent"
//                   }}
//                   className="transition-colors hover:bg-slate-50"
//                 >
//                   <td className={`p-2 ${segment.isTotal ? "font-semibold" : ""}`}>
//                     {segment.segment === "Premium" && (
//                       <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: moneyColors.money.primary }}></span>
//                     )}
//                     {segment.segment === "Standard" && (
//                       <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: moneyColors.money.secondary }}></span>
//                     )}
//                     {segment.segment === "Starter" && (
//                       <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: moneyColors.money.info }}></span>
//                     )}
//                     {segment.segment}
//                   </td>
//                   <td className={`text-right p-2 ${segment.isTotal ? "font-semibold" : ""}`}>{segment.count}</td>
//                   <td className={`text-right p-2 ${segment.isTotal ? "font-semibold" : ""}`}>{segment.avgAssets}</td>
//                   <td className={`text-right p-2 ${segment.isTotal ? "font-semibold" : ""}`}>
//                     <span 
//                       className="px-2 py-1 rounded-full text-xs"
//                       style={{ 
//                         backgroundColor: segment.isTotal ? "transparent" : `${moneyColors.money.success}20`,
//                         color: segment.isTotal ? "inherit" : moneyColors.money.success
//                       }}
//                     >
//                       {segment.goalCompletion}
//                     </span>
//                   </td>
//                   <td className={`text-right p-2 ${segment.isTotal ? "font-semibold" : ""}`} style={{ 
//                     color: segment.isTotal ? moneyColors.money.primary : "inherit"
//                   }}>
//                     {segment.revenue}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }