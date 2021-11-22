import React from 'react'
import './Header.scss'
import {AiOutlineFire, GiPodiumWinner, GiSevenPointedStar, MdFavoriteBorder} from "react-icons/all";

const Header = ({activeFilter,changeActiveFilter,showFavorite,isFavorite}) => {

    const handleFavorite = ()=>{
        changeActiveFilter('favorite')
        showFavorite()
    }

    return(
        <div className='header-wrapper'>
            <div className='header-container'>
                <div className='header'>

                    <div className={ activeFilter === 'hot' ? ('header-filter-active'):('header-filter')}
                         onClick={()=>changeActiveFilter('hot')}>
                        <AiOutlineFire className={ activeFilter === 'hot' ? ('activeFilter'):('defaultFilter')} />
                        Hot
                    </div>
                    <div className={ activeFilter === 'new' ? ('header-filter-active'):('header-filter')}
                         onClick={()=>changeActiveFilter('new')}>
                        <GiSevenPointedStar className={ activeFilter === 'new' ? ('activeFilter'):('defaultFilter')}/>
                        New

                    </div>
                    <div className={ activeFilter === 'top' ? ('header-filter-active'):('header-filter')}
                         onClick={()=>changeActiveFilter('top')}>
                        <GiPodiumWinner className={ activeFilter === 'top' ? ('activeFilter'):('defaultFilter')}/>
                        Top
                    </div>
                    <div className={ activeFilter === 'favorite' ? ('header-filter-active'):('header-filter')}>
                        <MdFavoriteBorder className={ activeFilter === 'favorite' ? ('activeFilter'):('defaultFilter')}
                                          onClick={()=>handleFavorite()}/>
                        Favorite
                    </div>
                </div>


            </div>

        </div>
    )
}
export  default Header;
