import {firebase,FieldValue} from '../lib/firebase';

export async function doesUsernameExist(username){
    const result=await firebase
    .firestore()
    .collection('users')
    .where('username','==',username)
    .get();
    

    return result.docs.length > 0;
}

export async function getUserByUsername(username){
  const result=await firebase
  .firestore()
  .collection('users')
  .where('username','==',username)
  .get();
  

  return result.docs.map((item)=>({
    ...item.data(),
    docId: item.id
  }))
  
}

export async function getUserByUserId(userId){
    const result=await firebase
    .firestore()
    .collection('users')
    .where('userId','==',userId)
    .get();

    const user=result.docs.map((item) =>({
        ... item.data(),
        docId:item.id
    }))
    return user;
}

export async function getSuggestedProfiles(userId, following) {
    const result = await firebase.firestore().collection('users').limit(10).get();

    return result.docs
        .map((user) => ({ ...user.data(), docId: user.id }))
        .filter((profile) => profile.userId !== userId && (following ? !following.includes(profile.userId) : true));
}


//updateLoggedInUserFollowing, updateFollowedUserFollowers

export async function updateLoggedInUserFollowing(loggedInUserDocId, profileId, isFollowingProfile) {
    const userRef = firebase.firestore().collection('users').doc(loggedInUserDocId);
  
    try {
      const userDoc = await userRef.get();
  
      if (userDoc.exists) {
        await userRef.update({
          following: isFollowingProfile
            ? FieldValue.arrayRemove(profileId)
            : FieldValue.arrayUnion(profileId),
        });
        console.log('updateLoggedInUserFollowing success:', loggedInUserDocId, profileId, isFollowingProfile);
      } else {
        console.error(`updateLoggedInUserFollowing: User document with ID ${loggedInUserDocId} not found.`);
      }
    } catch (error) {
      console.error('updateLoggedInUserFollowing error:', error);
    }
  }
  
  export async function updateFollowedUserFollowers(profileDocId, loggedInUserDocId, isFollowingProfile) {
    const userRef = firebase.firestore().collection('users').doc(profileDocId);
  
    try {
      await userRef.update({
        followers: isFollowingProfile
          ? FieldValue.arrayRemove(loggedInUserDocId)
          : FieldValue.arrayUnion(loggedInUserDocId),
      });
      console.log('updateFollowedUserFollowers success:', profileDocId, loggedInUserDocId, isFollowingProfile);
    } catch (error) {
      console.error('updateFollowedUserFollowers error:', error);
    }
  }

  export async function getPhotos(userId,following){
    const result=await firebase
    .firestore()
    .collection('photos')
    .where('userId','in',following)
    .get();

    const userFollowedPhotos=result.docs.map((photo)=>({
      ... photo.data(),
      docId: photo.id
    }))

    const photosWithUserDetails = await Promise.all(
      userFollowedPhotos.map(async (photo)=>{
        let userLikedPhoto=false;
        if(photo.likes.includes(userId)){
          userLikedPhoto=true;
        }
        const user= await getUserByUserId(photo.userId);
        const {username}=user[0];
        return {username,...photo,userLikedPhoto};
      })
    )
    return photosWithUserDetails
  }

  export async function getUserIdByUsername(username) {
    // Make sure the username is provided
    if (!username) {
      throw new Error("Username is required");
    }
  
    // Query Firestore to find the user with the given username
    const snapshot = await firebase
      .firestore()
      .collection('users') // 'users' collection
      .where('username', '==', username) // Searching by the 'username' field
      .get();
  
    // If no user is found, return null or an empty value
    if (snapshot.empty) {
      return null;
    }
  
    // Get the first document in the snapshot (assuming the username is unique)
    const user = snapshot.docs[0].data();
  
    // Return the user ID (assuming the field name is 'userId')
    return user ? user.userId : null;
  }
  

  export async function getUserPhotosByUsername(username) {
    // Get the userId for the given username
    const userId = await getUserIdByUsername(username);
    
    // Check if userId is valid
    if (!userId) {
      console.error("User not found for username:", username);
      return []; // Or handle the error as needed
    }
  
    // Query photos collection using userId
    const result = await firebase
      .firestore()
      .collection('photos')
      .where('userId', '==', userId)
      .get();
  
    return result.docs.map((item) => ({
      ...item.data(),
      docId: item.id,
    }));
  }
  

  //8:12