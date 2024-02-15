import {firebase,FieldValue} from '../lib/firebase';

export async function doesUsernameExist(username){
    const result=await firebase
    .firestore()
    .collection('users')
    .where('username','==',username)
    .get();
    

    return result.docs.length > 0;
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