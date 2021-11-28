import bgImage from '../Assets/SkyRocket5.jpg'

import { makeStyles } from '@material-ui/core/styles';
import { blue, grey } from '@material-ui/core/colors';

export const divStyleNotMobile = {display: 'flex', 
        flexDirection: 'column', 
        // outer alignment - where to place the list i.e. all elements? center or left?
        alignItems: 'center', 
        justifyContent: 'center', 
        height: "100%" ,
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 700,
        // for scrollable case
        overflow: "auto",
        backgroundAttachment: 'fixed', 
        // required for not scrollable case
        position: "absolute", 
        top: 0, 
        bottom: 0, 
        left:0 , 
        right: 0, 
}

export const divStyleMobile = {display: 'flex', 
        flexDirection: 'column', 
        // outer alignment - where to place the list i.e. all elements? center or left?
        alignItems: 'center', 
        justifyContent: 'center', 
        height: "100%" ,
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 700,
        // for scrollable case
        backgroundAttachment: 'fixed',
}

export const useStylesMobile = makeStyles({
        root: { 
            flexDirection: 'column',
            padding: "10%",
        },
        card: {
            // expanding card
        //   width: '100%',
          height: 100,  
        },
        gridItem: {
            marginTop: 20,
            // marginRight: 10,
            // marginLeft: 10,    
            // fixed card 
            width: 300,
            alignSelf: 'center',
        },
    
    });
    
export const useStylesNotMobile = makeStyles({
        root: { 
            flexDirection: 'row',
            padding: 50,
            // inner alignment--- say 7 elements in 3 element grid, determines how the last row is aligned
            alignItems: 'center',
            justifyContent: 'center',
            // if not provided, first row will hide behind AppBar 
            overflow: 'auto',
        },
        card: {
            width: '100%',
            height: 150,
        },
        gridItem: {
            width: 350,
            marginTop: 20,
            marginRight: 10,
            marginLeft: 10,
        },
    });
    
export const useStylesCommon = makeStyles({
        title: {
          fontSize: 14,
        },
        cbStyle: {
            color: blue[400],
        },
        done: {
            color: blue[900],
            padding: 0,
        },
        grey: {
            color: grey[600],
            padding: 0
        },
        btn: {
            position: 'fixed',
            bottom: 20,
        }
    });
    
    