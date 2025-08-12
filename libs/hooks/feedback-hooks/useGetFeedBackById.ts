import { FeedBackEntity } from "@/backend/feedbacks/domains/entities/FeedBackEntity";
import { getFeedBackById } from "@/libs/api/feedback.api";
import { useQuery } from "@tanstack/react-query";

export const useGetFeedBackById = (id: number) => {
  const { data, isLoading, error } = useQuery<FeedBackEntity>({
    queryKey: ["feedBack", id],
    queryFn: () => getFeedBackById(id),
    enabled: Number.isFinite(id) && id > 0,
  });

  return { data, isLoading, error };
};
