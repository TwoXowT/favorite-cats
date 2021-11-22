import React, {useEffect, useState} from 'react'
import './MainContainer.scss'
import axios from "axios";
import Card from "../card/Card";
import Header from "../header/Header";
import InfiniteScroll from "react-infinite-scroll-component";
const MainContainer = () => {
    const [posts, setPosts] = useState([]);
    const [favoritePost, setFavoritePost] = useState()
    const [isFavorite,setIsFavorite] = useState(false)
    const [postType, setPostType] = useState('top');
    const [fetchDirection, setFetchDirection] = useState({
        after: null,
    });
    const [indexDb, setIndexDb] = useState('')

    const getQueryParams = (queryParams) => {
        let queryString
        if(queryParams !== null){
           queryString = `limit=${queryParams.limit}&raw_json=${queryParams.raw_json}`
            console.log('AFTER',queryParams.after)
            if(queryParams.after !== null){
                queryString+=`&after=${queryParams.after}`
            }

        }
        return queryString

    };

    const fetchSubredditCatsList = async (isNext=true) => {
        const queryParam = {
            limit: 10,
            raw_json: 1,
            after: isNext ? fetchDirection.after : null,
        };
        const fetchURL = `https://www.reddit.com/r/cats/${postType}.json?&${getQueryParams(queryParam)}`;
        const response = await axios(
            fetchURL,
        ) ?? [];

        const postWithMediaContent = response?.data?.data?.children.filter(({ data }) => 'preview' in data);
        setFetchDirection({
            after: response?.data?.data?.after,
        });

        if(isNext){
            setPosts(posts.concat(postWithMediaContent))
        }else{
            setPosts(postWithMediaContent);
        }

    };

    useEffect(()=>{

        fetchSubredditCatsList(false)
    },[postType])

    useEffect(()=>{

      let request = window.indexedDB.open("favoritePost", 1);
      request.onerror = function(e) {
          console.log('IndexDb error: ', e.target.errorCode)
      };
      request.onupgradeneeded = function(e) {
          const db = e.target.result;
          db.createObjectStore('favorites',{ autoIncrement: true })
      };
      request.onsuccess = function (e){
          setIndexDb(e.target.result)
      }

    })

    const addFavorite = (post) =>{
        console.log('savePost',post)
        let transaction = indexDb.transaction('favorites','readwrite')
        let objectStore = transaction.objectStore('favorites')
        objectStore.add(post)
        transaction.oncomplete = function (e){
            console.log('Success')
        }
        transaction.onerror = function(e){
            console.log('ERROR', e.target.errorCode)
        }
    }


    const delFromDb = (post) =>{
        if (indexDb) {
            let tx = indexDb.transaction(['favorites'], 'readwrite');
            let store = tx.objectStore('favorites');
            let req = store.openCursor();
            req.onsuccess = (event) => {
                let cursor = event.target.result;
                if (cursor !== null) {
                    if(cursor.value.title === post.title){
                        let del = store.delete(cursor)
                        del.onsuccess = function (){
                            console.log('delete succsess')
                        }
                    }
                    cursor.continue();
                }
            };
            req.onerror = (event) => {
                alert(`error in cursor request ${event.target.errorCode}`);
            };
        }

    }

    const handleChangePostType = (type)=>{
        if(type !== 'favorite'){
            setIsFavorite(false)
        }
        setPostType(type)
    }

    const handleShowFavorite = ()=>{
        showFavorites()
        setIsFavorite(true)
    }

    const showFavorites = () => {
        let allPosts = [];
        if (indexDb) {
            let tx = indexDb.transaction(['favorites'], 'readonly');
            let store = tx.objectStore('favorites');
            let req = store.openCursor();
            req.onsuccess = (event) => {
                let cursor = event.target.result;
                console.log('cursor',cursor)
                if (cursor != null) {
                    allPosts.push(cursor.value);
                    cursor.continue();
                } else {
                    setFavoritePost(allPosts)
                }
            };
            req.onerror = (event) => {
                alert(`error in cursor request ${event.target.errorCode}`);
            };
        }

       setFavoritePost(allPosts);
    };

    return(
        <div className='mainContainer'>
            <Header activeFilter={postType}
                    changeActiveFilter={handleChangePostType}
                    showFavorite={handleShowFavorite}/>

            <InfiniteScroll next={fetchSubredditCatsList}
                            hasMore={ isFavorite ? (false):(true)}
                            loader={<h2>Loading...</h2>}
                            dataLength={posts.length}
                            >
                {isFavorite ?
                    (favoritePost.map((card)=>
                    <Card key={card.id}
                          ups = {card.ups}
                          author={card.author}
                          title={card.title}
                          media={card?.media}
                          preview={card?.preview}
                          comments={card?.num_comments}
                          saveToDb={addFavorite}
                          delFromDb={delFromDb}
                          fromDb={true}
                    />))
                    :
                    (
                        (posts.map((card)=>
                            <Card key={card.data.id}
                                  ups = {card.data?.ups}
                                  author={card.data.author}
                                  title={card.data.title}
                                  media={card.data?.media}
                                  preview={card.data?.preview}
                                  comments={card.data?.num_comments}
                                  saveToDb={addFavorite}
                                  fromDb={false}/>))

                )}
            </InfiniteScroll>
        </div>
    )
}
export default MainContainer;
