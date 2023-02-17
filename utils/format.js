/** @format */

import "intl";
import "intl/locale-data/jsonp/es"; // or any other locale you need

const format = (cantidad) => {
  return cantidad.toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
  });
};

// const format = (value) => {
//   // Crear formateador
//   const formatter = new Intl.NumberFormat("es-CL", {
//     style: "currency",
//     currency: "CLP",
//     // minimumFractionDigits: 2,
//     //  maximumFractionDigits: 2,
//   });

//   return formatter.format(value); //$2,500.00
// };

export default format;
