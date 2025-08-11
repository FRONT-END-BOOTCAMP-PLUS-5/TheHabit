import {FollowerDto} from "@/backend/follows/applications/dtos/FollowerDto";
import {FollowingDto} from "@/backend/follows/applications/dtos/FollowingDto";
import {ListComponent} from "@/app/user/follow/components/List";

interface IContent{
    data?:  FollowerDto | FollowingDto;
}


export const ContentComponent = ({ data }:IContent) => {
    return (
        <div id="follow_content" className="mt-5 mb-5 flex justify-around h-[450px] overflow-scroll">
            <ul className="w-full">
                { data && ('followers' in data ?
                        data?.followers.map((follower) => {
                            return (
                                <ListComponent key={follower.fromUser.id} data={follower.fromUser} type={'follower'}/>
                            )
                        }) : data?.following.map((following) => {
                            return (
                                <ListComponent key={following.toUser.id} data={following.toUser} type={'following'}/>
                            )
                        })
                )
                }
            </ul>
        </div>
    )
}