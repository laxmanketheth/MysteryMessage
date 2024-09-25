'use client'

import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/model/User"
import { AcceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
setTimeout(() => {
  console.log('this is inside dashboard file line 24');
},2000)

const UserDashboard = () => {
  setTimeout(() => {
    console.log('this is inside dashboard file line 24');
  },2000)
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [baseUrl, setBaseUrl] = useState('');
  const router = useRouter();
  const { toast } = useToast();
  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId))
  };

  setTimeout(() => {
    console.log('this is inside dashboard file after routing');
  },2000)

  

  const { data: session } = useSession();
  console.log('session in dashboard line 36',session);
  
  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema)
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch('acceptMessages');

  // here i am using useCallback for fetchAcceptMessage and fetchMessages so that when the useEffect runs then these two functions dont run on every render unless their dependencies change.
  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages');
      setValue('acceptMessages', response.data.isAcceptingMessage);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message ||
          "Failed to fetch message settings",
        variant: 'destructive'
      })
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);


  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true)
    setIsSwitchLoading(false)
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages')
      // console.log('response of get-msgs',response.data);
      // console.log('response of get-msgs', response.data.message);

      const newMessages: Message[] = Array.isArray(response.data.message)
        ? response.data.message
        : []; // Default to an empty array if it's not an array

      setMessages(newMessages);

      // setMessages(response.data.message || [])

      if (refresh) {
        toast({
          title: 'Refreshed Messages',
          description: "Showing latest messages"
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message ||
          "Failed to fetch message settings",
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
      setIsSwitchLoading(false)
    }
  }, [setIsLoading, setMessages, toast]);

  // Fetch initial state from the server
  useEffect(() => {
    if (!session || !session.user) return;

    fetchMessages();
    fetchAcceptMessage();
  }, [session, setValue, toast, fetchAcceptMessage, fetchMessages])


  //====== handle switch change ========//
  const handleSwitchChange = async () => {
    try {
      // Toggle the current state
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages
      });
      setValue('acceptMessages', !acceptMessages)
      toast({
        title: response.data.message,
        variant: 'default'
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message ||
          "Failed to fetch message settings",
        variant: 'destructive'
      })
    }
  };

  const username = session?.user?.username;
  // const { username } = session?.user as User;
  
  // TODO: do more research
  // console.log(window.location);
  // const baseUrl = `${window.location.protocol}//${window.location.host}`;

  useEffect(() => {
    // This will run only on the client
    const url = `${window.location.protocol}//${window.location.host}`;
    setBaseUrl(url);
    setTimeout(() => {
      console.log('this is inside dashboard file line 24');
    },2000)
  }, []);

  const profileUrl = `${baseUrl}/u/${username}`;

  //makeing the copy functionality to copy the url to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast({
      title: "URL copied",
      description: "Profile URL has been copied to clipboard."
    });
  };

  if (!session || !session.user) {
    // console.log(session.user);
    return <div className="text-center mt-10">Please login or head back to Home Page</div>
  };


  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={index}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>

    </div>
  )
}

export default UserDashboard;
// export default dynamic (() => Promise.resolve(UserDashboard), {ssr: false})

