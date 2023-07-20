import React from 'react'
import { useState,useEffect } from 'react'
import BlogCard from './BlogCard'
import axios from 'axios'

const UserBlogs = () => {
    const [blogs,setBlogs] = useState([])

    const getUserBlogs = async () =>{
        try {
            const id = localStorage.getItem("userId")
            console.log(id)
            const {data} = await axios.get(`api/v1/blogs/user-blog/${id}`)
            if(data?.success){
                setBlogs(data?.userBlog.blogs)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        getUserBlogs();
    },[])

    console.log(blogs)

  return (
    <div>
      {
        blogs.map((blog) => 
          <BlogCard
            title={blog.title}
            description={blog.description}
            image={blog.image}
            username={blog.username}
            blogId={blog._id}
            belongsToUser={blog.user===localStorage.getItem("userId")}
          />
        )}
    </div>
  )
}

export default UserBlogs