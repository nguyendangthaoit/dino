import React, { Component } from 'react';
import LeftToolBox from './LeftToolBox';
import RightColorBox from './RightColorBox';
import CenterMain from './CenterMain';
class IndexHome extends Component {
    render() {
        return (
            <div className="contaninehome" >
                <div className="container" >
                    <div className="row rowhome">
                        <div className="col-2 col-lg-2">
                            <LeftToolBox />
                        </div>
                        <div className="col-8 col-lg-8 centerMain">
                            <CenterMain />
                        </div>
                        <div className="col-2 col-lg-2">
                            <RightColorBox />
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}
export default IndexHome
