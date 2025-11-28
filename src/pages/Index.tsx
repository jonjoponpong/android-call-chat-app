import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';

export default function Index() {
  const [activeTab, setActiveTab] = useState('chats');
  const [selectedChat, setSelectedChat] = useState<number | null>(null);

  const mockChats = [
    { id: 1, name: 'Анна Петрова', message: 'Привет! Как дела?', time: '14:32', unread: 3, online: true, avatar: '' },
    { id: 2, name: 'Команда Проекта', message: 'Встреча в 15:00', time: '13:45', unread: 0, online: false, avatar: '', isGroup: true },
    { id: 3, name: 'Максим Иванов', message: 'Отправил файлы', time: '12:20', unread: 1, online: true, avatar: '' },
    { id: 4, name: 'Мария Сидорова', message: 'Спасибо за помощь!', time: 'Вчера', unread: 0, online: false, avatar: '' },
    { id: 5, name: 'Александр', message: 'Созвонимся завтра?', time: 'Вчера', unread: 0, online: true, avatar: '' },
  ];

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
          <h1 className="text-2xl font-bold">ConnectApp</h1>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
            <Icon name="Settings" size={24} />
          </Button>
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
              {mockChats.map((chat, index) => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat.id)}
                  className="p-4 hover:bg-muted/50 cursor-pointer transition-colors active:bg-muted animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-14 w-14 border-2 border-white shadow-md">
                        <AvatarImage src={chat.avatar} />
                        <AvatarFallback className={chat.isGroup ? "bg-secondary text-white" : "bg-primary text-white"}>
                          {chat.isGroup ? <Icon name="Users" size={20} className="text-white" /> : chat.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      {chat.online && (
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-base truncate">{chat.name}</h3>
                        <span className="text-xs text-muted-foreground">{chat.time}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground truncate">{chat.message}</p>
                        {chat.unread > 0 && (
                          <Badge className="ml-2 bg-accent hover:bg-accent text-white min-w-[20px] h-5 flex items-center justify-center rounded-full">
                            {chat.unread}
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
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-4xl">
                      ВИ
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    className="absolute bottom-0 right-0 h-10 w-10 rounded-full shadow-lg bg-accent hover:bg-accent/90 text-white"
                  >
                    <Icon name="Camera" size={20} />
                  </Button>
                </div>
                <h2 className="text-2xl font-bold mb-1">Ваше Имя</h2>
                <p className="text-muted-foreground">В сети</p>
              </div>

              <Card className="p-4 space-y-3">
                <div className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon name="User" size={20} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Имя пользователя</p>
                    <p className="font-medium">@username</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors">
                  <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center">
                    <Icon name="Phone" size={20} className="text-secondary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Телефон</p>
                    <p className="font-medium">+7 (999) 123-45-67</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors">
                  <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <Icon name="Mail" size={20} className="text-accent" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">user@example.com</p>
                  </div>
                </div>
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
    </div>
  );
}
