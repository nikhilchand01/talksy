import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import {
  getRecommendedUsers,
  getUserFriends,
  getOutgoingFriendReqs,
  sendFriendRequest,
} from '../lib/api.js';
import FriendCard from '../components/FriendCard.jsx';
import NoFriendsFound from '../components/NoFriendsFound.jsx';
import {
  CheckCircleIcon,
  MapPinIcon,
  UserIcon,
  UserPlusIcon,
} from 'lucide-react';
import { Link } from 'react-router'; 


const FriendsPage = () => {
   const queryClient = useQueryClient();
  const [outgoingrequestIds, setOutgoingRequestIds] = useState(new Set());

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ['friends'], 
    queryFn: getUserFriends,
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ['outgoingFriendReqs'],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['outgoingFriendReqs'] }), 
  });

  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        //console.log(req);
        outgoingIds.add(req.recipient._id);
      });
      setOutgoingRequestIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);
   return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Your Friends
          </h2>
          <Link to="/notifications" className="btn btn-outline btn-sm">
            <UserIcon className="mr-2 size-4" />
            Friend Requests
          </Link>
        </div>

        {loadingFriends ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FriendsPage