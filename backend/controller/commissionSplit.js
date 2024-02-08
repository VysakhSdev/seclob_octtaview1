import { errorHandler } from "../middleware/errorHandler.js";
import User from "../models/userModel.js";



export const allUserCommissionSplit=async(req,res,next)=>{
    const {percentage}=req.body;
    console.log("percentage:",percentage);
    try {
        const userData = await User.find({ isSuperAdmin: { $ne: true }, packageAmount: { $ne: 0 } });

        if(userData){
            userData.forEach(async(user)=>{
                
                const capitalAmount=user.packageAmount;
                const dailyROI=(capitalAmount*percentage)/100;
                user.dailyROI=dailyROI;
                user.dailyROIHistory.push({
                    reportName:"ROIIncome",
                    name:user.username ,
                    capitalAmount:user.capitalAmount,
                    percentage:percentage,
                    creditedAmount: dailyROI,
                })
                user.walletAmount=user.walletAmount+dailyROI;
                    await user.save();
               
                      
            })

        // Assuming allUserCommissionSplit has been executed

const allUsers = await User.find({ isSuperAdmin: { $ne: true }, packageAmount: { $ne: 0 } });

allUsers.forEach(async (user) => {
 const level1ROI= await user.calculateLevel1ROI();
  const level2ROI=await user.calculateLevel2ROI();
  const level3ROI=await user.calculateLevel3ROI();
console.log("level1ROI",level1ROI);
console.log("level2ROI",level2ROI);
console.log("level3ROI",level3ROI);
console.log("walletAmount",user.walletAmount);
console.log("walletAmount",user.walletAmount);



  user.walletAmount=user.walletAmount+(level1ROI+level2ROI+level3ROI)
  await user.save();

});

        
        
        

        res.status(200).json({
            msg: "Commission split Success",
          });


            
        }else{
            next(errorHandler("No Users are Found"))
        }

        
    } catch (error) {
        next(error)
    }

}





