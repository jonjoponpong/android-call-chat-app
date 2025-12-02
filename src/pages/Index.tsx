import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import EditProfileDialog from '@/components/EditProfileDialog';
import ChatWindow from '@/components/ChatWindow';
import VideoCallWindow from '@/components/VideoCallWindow';
import CallModal from '@/components/CallModal';
import ThemeToggle from '@/components/ThemeToggle';

interface UserProfile {
  id: number;
  username: string;
  full_name: string;
  email: string;
  phone: string;
  bio?: string;
  status?: string;
  avatar_url?: string;
}

interface Chat {
  id: number;
  name: string;
  is_group: boolean;
  last_message?: string;
  last_message_time?: string;
  unread_count?: number;
  avatar_url?: string;
}

export default function Index() {
  const [activeTab, setActiveTab] = useState('chats');
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeCall, setActiveCall] = useState<{type: 'audio' | 'video', userName: string, userAvatar?: string} | null>(null);
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [callConfig, setCallConfig] = useState<{contactName: string, isVideo: boolean, isOutgoing: boolean}>({contactName: '', isVideo: false, isOutgoing: true});
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: 1,
    username: 'username',
    full_name: 'Ваше Имя',
    email: 'user@example.com',
    phone: '+7 (999) 123-45-67',
    bio: 'Привет! Я использую СпецСвязь',
    status: 'online',
  });

  useEffect(() => {
    fetchUserProfile();
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/f417f6a0-d66b-4378-a1c5-23b680124a78?action=list&user_id=1');
      if (response.ok) {
        const data = await response.json();
        const uniqueChats = data.reduce((acc: Chat[], current: Chat) => {
          const exists = acc.find(c => c.id === current.id);
          if (!exists) {
            acc.push(current);
          }
          return acc;
        }, []);
        setChats(uniqueChats);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/38ac0446-e092-4229-83a7-24d3cd6efe56?id=1');
      if (response.ok) {
        const data = await response.json();
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    if (diffHours < 24) {
      return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    }
    return 'Вчера';
  };

  const mockCalls = [
    { id: 1, name: 'Анна Петрова', type: 'video', time: '14:15', duration: '12:34', incoming: true, avatar: '' },
    { id: 2, name: 'Максим Иванов', type: 'audio', time: '10:30', duration: '5:21', incoming: false, avatar: '' },
    { id: 3, name: 'Команда Проекта', type: 'video', time: 'Вчера', duration: '45:12', incoming: true, avatar: '', isGroup: true },
    { id: 4, name: 'Мария Сидорова', type: 'audio', time: 'Вчера', duration: '2:15', incoming: false, avatar: '' },
  ];

  const mockContacts = [
    { id: 1, name: 'Анна Петрова', status: 'В сети', online: true, avatar: '' },
    { id: 2, name: 'Максим Иванов', status: 'Был(а) недавно', online: false, avatar: '' },
    { id: 3, name: 'Мария Сидорова', status: 'В сети', online: true, avatar: '' },
    { id: 4, name: 'Александр', status: 'Был(а) 2 часа назад', online: false, avatar: '' },
    { id: 5, name: 'Екатерина', status: 'В сети', online: true, avatar: '' },
  ];

  return (
    <div className="h-screen bg-background flex flex-col max-w-md mx-auto shadow-2xl">
      <div className="bg-gradient-to-r from-primary to-secondary p-4 text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img 
              src="https://cdn.poehali.dev/projects/795edbcb-f9ba-4b65-a66c-842c8382c6cd/files/628b04e1-5982-4426-9126-bd7e556b5801.jpg" 
              alt="СпецСвязь"
              className="h-10 w-10 object-contain"
            />
            <h1 className="text-2xl font-bold">СпецСвязь</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <Icon name="Settings" size={24} />
            </Button>
          </div>
        </div>
        
        <div className="relative">
          <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input 
            placeholder="Поиск..." 
            className="pl-10 bg-white/90 border-0 focus-visible:ring-2 focus-visible:ring-white"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="w-full grid grid-cols-4 bg-card border-b rounded-none h-14">
          <TabsTrigger value="chats" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <div className="flex flex-col items-center gap-1">
              <Icon name="MessageSquare" size={20} />
              <span className="text-xs">Чаты</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="calls" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <div className="flex flex-col items-center gap-1">
              <Icon name="Phone" size={20} />
              <span className="text-xs">Звонки</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="contacts" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <div className="flex flex-col items-center gap-1">
              <Icon name="Users" size={20} />
              <span className="text-xs">Контакты</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="profile" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <div className="flex flex-col items-center gap-1">
              <Icon name="User" size={20} />
              <span className="text-xs">Профиль</span>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chats" className="flex-1 m-0 animate-fade-in">
          <ScrollArea className="h-full">
            <div className="divide-y">
              {chats.map((chat, index) => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className="p-4 hover:bg-muted/50 cursor-pointer transition-colors active:bg-muted animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-14 w-14 border-2 border-white shadow-md">
                        <AvatarImage src={chat.avatar_url} />
                        <AvatarFallback className={chat.is_group ? "bg-secondary text-white" : "bg-primary text-white"}>
                          {chat.is_group ? <Icon name="Users" size={20} className="text-white" /> : chat.name[0]}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-base truncate">{chat.name}</h3>
                        <span className="text-xs text-muted-foreground">{formatTime(chat.last_message_time)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground truncate">{chat.last_message || 'Нет сообщений'}</p>
                        {chat.unread_count && chat.unread_count > 0 && (
                          <Badge className="ml-2 bg-accent hover:bg-accent text-white min-w-[20px] h-5 flex items-center justify-center rounded-full">
                            {chat.unread_count}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <Button
            size="lg"
            className="absolute bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl bg-accent hover:bg-accent/90 text-white animate-scale-in"
          >
            <Icon name="Plus" size={24} />
          </Button>
        </TabsContent>

        <TabsContent value="calls" className="flex-1 m-0 animate-fade-in">
          <ScrollArea className="h-full">
            <div className="divide-y">
              {mockCalls.map((call, index) => (
                <div
                  key={call.id}
                  className="p-4 hover:bg-muted/50 cursor-pointer transition-colors animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-14 w-14 border-2 border-white shadow-md">
                      <AvatarImage src={call.avatar} />
                      <AvatarFallback className={call.isGroup ? "bg-secondary text-white" : "bg-primary text-white"}>
                        {call.isGroup ? <Icon name="Users" size={20} className="text-white" /> : call.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-base">{call.name}</h3>
                        <Icon 
                          name={call.incoming ? "ArrowDownLeft" : "ArrowUpRight"} 
                          size={14}
                          className={call.incoming ? "text-green-500" : "text-primary"}
                        />
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Icon name={call.type === 'video' ? "Video" : "Phone"} size={14} />
                        <span>{call.time}</span>
                        <span>•</span>
                        <span>{call.duration}</span>
                      </div>
                    </div>
                    
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-primary hover:bg-primary/10 rounded-full"
                      onClick={() => {
                        setCallConfig({
                          contactName: call.name,
                          isVideo: call.type === 'video',
                          isOutgoing: true
                        });
                        setCallModalOpen(true);
                      }}
                    >
                      <Icon name={call.type === 'video' ? "Video" : "Phone"} size={20} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <div className="absolute bottom-6 right-6 flex flex-col gap-3">
            <Button
              size="lg"
              className="h-12 w-12 rounded-full shadow-xl bg-secondary hover:bg-secondary/90 text-white animate-scale-in"
              style={{ animationDelay: '100ms' }}
            >
              <Icon name="Video" size={22} />
            </Button>
            <Button
              size="lg"
              className="h-14 w-14 rounded-full shadow-2xl bg-accent hover:bg-accent/90 text-white animate-scale-in"
            >
              <Icon name="Phone" size={24} />
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="contacts" className="flex-1 m-0 animate-fade-in">
          <ScrollArea className="h-full">
            <div className="divide-y">
              {mockContacts.map((contact, index) => (
                <div
                  key={contact.id}
                  className="p-4 hover:bg-muted/50 cursor-pointer transition-colors animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-14 w-14 border-2 border-white shadow-md">
                        <AvatarImage src={contact.avatar} />
                        <AvatarFallback className="bg-primary text-white">{contact.name[0]}</AvatarFallback>
                      </Avatar>
                      {contact.online && (
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-base mb-1">{contact.name}</h3>
                      <p className="text-sm text-muted-foreground">{contact.status}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-secondary hover:bg-secondary/10 rounded-full"
                        onClick={() => {
                          setCallConfig({
                            contactName: contact.name,
                            isVideo: true,
                            isOutgoing: true
                          });
                          setCallModalOpen(true);
                        }}
                      >
                        <Icon name="Video" size={20} />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-primary hover:bg-primary/10 rounded-full"
                      >
                        <Icon name="MessageSquare" size={20} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="profile" className="flex-1 m-0 animate-fade-in">
          <ScrollArea className="h-full">
            <div className="p-6 space-y-6">
              <div className="flex flex-col items-center text-center animate-scale-in">
                <div className="relative mb-4">
                  <Avatar className="h-32 w-32 border-4 border-white shadow-xl">
                    <AvatarImage src={userProfile.avatar_url || ''} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-4xl">
                      {userProfile.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    className="absolute bottom-0 right-0 h-10 w-10 rounded-full shadow-lg bg-accent hover:bg-accent/90 text-white"
                    onClick={() => setEditDialogOpen(true)}
                  >
                    <Icon name="Edit" size={20} />
                  </Button>
                </div>
                <h2 className="text-2xl font-bold mb-1">{userProfile.full_name}</h2>
                <p className="text-muted-foreground">{userProfile.status === 'online' ? 'В сети' : 'Не в сети'}</p>
              </div>

              <Card className="p-4 space-y-3">
                <div className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors" onClick={() => setEditDialogOpen(true)}>
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon name="User" size={20} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Имя пользователя</p>
                    <p className="font-medium">@{userProfile.username}</p>
                  </div>
                  <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
                </div>

                <div className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors" onClick={() => setEditDialogOpen(true)}>
                  <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center">
                    <Icon name="Phone" size={20} className="text-secondary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Телефон</p>
                    <p className="font-medium">{userProfile.phone}</p>
                  </div>
                  <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
                </div>

                <div className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors" onClick={() => setEditDialogOpen(true)}>
                  <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <Icon name="Mail" size={20} className="text-accent" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{userProfile.email}</p>
                  </div>
                  <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
                </div>

                {userProfile.bio && (
                  <div className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors" onClick={() => setEditDialogOpen(true)}>
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon name="FileText" size={20} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">О себе</p>
                      <p className="font-medium">{userProfile.bio}</p>
                    </div>
                    <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
                  </div>
                )}
              </Card>

              <Card className="p-4 space-y-3">
                <div className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <Icon name="Bell" size={20} className="text-primary" />
                    <span className="font-medium">Уведомления</span>
                  </div>
                  <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
                </div>

                <div className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <Icon name="Lock" size={20} className="text-primary" />
                    <span className="font-medium">Приватность</span>
                  </div>
                  <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
                </div>

                <div className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <Icon name="Palette" size={20} className="text-primary" />
                    <span className="font-medium">Тема</span>
                  </div>
                  <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
                </div>

                <div className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <Icon name="HelpCircle" size={20} className="text-primary" />
                    <span className="font-medium">Помощь</span>
                  </div>
                  <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
                </div>
              </Card>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      <EditProfileDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        profile={userProfile}
        onSave={handleProfileUpdate}
      />

      {selectedChat && (
        <ChatWindow
          chat={selectedChat}
          onClose={() => {
            setSelectedChat(null);
            fetchChats();
          }}
          onCall={(type) => {
            setActiveCall({
              type,
              userName: selectedChat.name,
              userAvatar: selectedChat.avatar_url
            });
          }}
          currentUserId={userProfile.id}
        />
      )}

      {activeCall && (
        <VideoCallWindow
          userName={activeCall.userName}
          userAvatar={activeCall.userAvatar}
          callType={activeCall.type}
          onEnd={() => setActiveCall(null)}
        />
      )}

      <CallModal
        isOpen={callModalOpen}
        onClose={() => setCallModalOpen(false)}
        contactName={callConfig.contactName}
        isVideo={callConfig.isVideo}
        isOutgoing={callConfig.isOutgoing}
      />
    </div>
  );
}