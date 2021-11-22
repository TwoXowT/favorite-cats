import React, {useState} from 'react'
import './Card.scss'
import {AiFillHeart, AiOutlineArrowDown, AiOutlineArrowUp, AiOutlineLike, FaRegCommentAlt} from "react-icons/all";

const Card = ({ups,author,title,media,preview,comments,saveToDb,delFromDb,fromDb}) => {
    const [isFavorite, setIsFavorite] = useState(fromDb?(true):(false))

    const handleChangeFavorite = ()=>{
        console.log('ISFAVORITE?',isFavorite)
        if(isFavorite){

                setIsFavorite(false)
                delFromDb({ups,author,title,media,preview,comments,saveToDb,delFromDb})

            return
        }
        setIsFavorite(true)
        saveToDb({ups,author,title,media,preview,comments})
    }


    return(
        <div className='card-wrapper'>
            <div className='card-score'>
                <AiOutlineArrowUp fontSize='1.5em' color='#b2b4b6'/>
                {ups}
                <AiOutlineArrowDown fontSize='1.5em' color='#b2b4b6'/>
            </div>
            <div className='card-content'>
                <div className='card-author'>
                    <span>Posted by {author}</span>
                </div>

                <div className='card-description'>
                    {title}
                </div>

                <div className='card-img'>
                    {media ? (
                        <video
                            preload="auto"
                            src={media.reddit_video?.fallback_url}
                            loop
                            autoPlay/>
                    ):(
                        <img
                            src={preview?.images[0].resolutions[1].url}
                        />
                    )}
                </div>
                <div className='card-info'>
                    <div className='card-comments'>
                        <FaRegCommentAlt fontSize='1.6em' color='#b2b4b6'/>
                        <span>{comments} Comments</span>
                    </div>
                    <div className={isFavorite?('card-like-active'):('card-like')} onClick={handleChangeFavorite}>
                        <AiFillHeart className='likeImg' />
                    </div>
                </div>
            </div>

        </div>
    )
}
export  default Card;
