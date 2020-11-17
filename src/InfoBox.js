 import React from 'react'
 import { Card, CardContent, Typography } from '@material-ui/core';
 import './InfoBox.css'
 
 function InfoBox({ title, cases, isRed, active, total, ...props }) {



     return (
         <Card 
                onClick={props.onClick}
                className={`infoBox ${active && 'infoBox--selected'} 
                ${isRed && 'infoBox--red'}`}>
             <CardContent>
                
                 {/* title */}
                 <Typography className="infoBox__title" color="textSecondary"> {title}</Typography>

                 {/* number of cases */}
                 <h3 className="infoBox__cases">{cases}</h3>

                 {/* total */}
                 <Typography className="infoBox__total" color="textSecondary">
                    {total} Total
                 </Typography>
             </CardContent> 
         </Card>
     )
 } 
 
 export default InfoBox
 