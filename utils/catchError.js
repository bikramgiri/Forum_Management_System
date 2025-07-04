// const catchError = (fn)=>{
//       return (req,res,next)=>{
//             fn(req,res,next).catch((err)=>{
//                   return res.status(500).send(err.message)
//             })
//       }
// }

// module.exports = catchError


const catchError = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      return res.status(500).send(err.message);
    });
  };
};

module.exports = catchError;