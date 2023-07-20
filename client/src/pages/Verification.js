export const verifyName = (name) => {
    if (name.trim().length === 0) {
      return "please enter valid userName";
    }
    return null;
  };
  
  export const verifyEmail = (email) => {
    if (email.trim().length === 0) {
      return "email can't be empty";
    }
    return null;
  };
  
  export const verifyPassword = (password) => {
    if (password.trim().length === 0) {
      return "password can't be empty";
    }
    return null;
  };

  export const getPostDate = (dateString) => {
    const datetime = new Date(dateString);

    // Get the weekday
    const weekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const weekday = weekdays[datetime.getDay()];

    // Get the formatted date
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = datetime.toLocaleDateString("en-US", options);

    console.log("Weekday:", weekday);
    console.log("Formatted Date:", formattedDate);
    return `${weekday} ${formattedDate}`
  };

export const sortComments = (comments) =>{
  const newComments = comments.map((comment)=>{
    return {
      ...comment,
      newDate:new Date(comment.commentedAt)
    }
  })
  newComments.sort((a,b)=>b.newDate-a.newDate)
  return newComments
}