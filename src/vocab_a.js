// Формат строки: word|pos|перевод|IPA (UK)|русская подсказка|пример|перевод примера|тема|доп. (f:формы;s:синонимы;a:антонимы;c:сочетания;m:типичная ошибка)
VOCAB_RAW.A1 = `
hello|int|привет, здравствуйте|həˈləʊ|хэло́у|Hello, my name is Anna.|Здравствуйте, меня зовут Анна.|greet|s:hi;c:say hello
goodbye|int|до свидания|ˌɡʊdˈbaɪ|гудба́й|Goodbye, see you tomorrow!|До свидания, увидимся завтра!|greet|s:bye
please|adv|пожалуйста (просьба)|pliːz|пли:з|Can I have some water, please?|Можно мне воды, пожалуйста?|greet|m:В ответ на «спасибо» говорят не please, а You're welcome.
thank you|phr|спасибо|ˈθæŋk juː|сэ́нк ю: (θ — язык между зубами)|Thank you for your help.|Спасибо за помощь.|greet|s:thanks;c:thank you very much
sorry|adj|извините, жаль|ˈsɒri|со́ри|Sorry, I'm late.|Извините, я опоздал.|greet|c:I'm sorry;m:Чтобы привлечь внимание, лучше Excuse me, а не Sorry.
name|n|имя|neɪm|нэйм|What's your name?|Как тебя зовут?|greet|c:first name, surname
friend|n|друг, подруга|frend|фрэнд|She is my best friend.|Она моя лучшая подруга.|family|c:best friend, make friends
mother|n|мама, мать|ˈmʌðə|ма́зэ (ð — звонкий межзубный)|My mother is a doctor.|Моя мама — врач.|family|s:mum (UK), mom (US)
father|n|папа, отец|ˈfɑːðə|фа́:зэ|My father works in a bank.|Мой папа работает в банке.|family|s:dad
brother|n|брат|ˈbrʌðə|бра́зэ|I have one brother.|У меня один брат.|family
sister|n|сестра|ˈsɪstə|си́стэ|My sister is ten.|Моей сестре десять лет.|family
son|n|сын|sʌn|сан|Their son is a student.|Их сын — студент.|family
daughter|n|дочь|ˈdɔːtə|до́:тэ|They have a daughter.|У них есть дочь.|family|m:gh не читается
husband|n|муж|ˈhʌzbənd|ха́збэнд|Her husband is from Spain.|Её муж из Испании.|family
wife|n|жена|waɪf|вайф (w — губы трубочкой)|His wife is a teacher.|Его жена — учительница.|family|f:wives
child|n|ребёнок|tʃaɪld|чайлд|The child is sleeping.|Ребёнок спит.|family|f:children
baby|n|младенец|ˈbeɪbi|бэ́йби|The baby is crying.|Малыш плачет.|family
parents|n|родители|ˈpeərənts|пэ́эрэнтс|My parents live in Almaty.|Мои родители живут в Алматы.|family|m:parents — только родители, а не все родственники (relatives)
apple|n|яблоко|ˈæpl|э́пл (æ — широкое «э»)|I eat an apple every day.|Я ем яблоко каждый день.|food|c:apple juice
bread|n|хлеб|bred|брэд|We need some bread.|Нам нужен хлеб.|food|m:Неисчисляемое: some bread, a loaf of bread
water|n|вода|ˈwɔːtə|уо́:тэ|Can I have a glass of water?|Можно стакан воды?|food|m:Неисчисляемое: не «a water», а a glass of water
milk|n|молоко|mɪlk|милк|I drink milk in the morning.|Я пью молоко утром.|food
coffee|n|кофе|ˈkɒfi|ко́фи|Would you like some coffee?|Хотите кофе?|food
tea|n|чай|tiː|ти:|I drink tea with lemon.|Я пью чай с лимоном.|food
egg|n|яйцо|eɡ|эг|I have two eggs for breakfast.|На завтрак я ем два яйца.|food
cheese|n|сыр|tʃiːz|чи:з|This cheese is very good.|Этот сыр очень вкусный.|food
meat|n|мясо|miːt|ми:т|I don't eat meat.|Я не ем мясо.|food
fish|n|рыба|fɪʃ|фиш|We have fish for dinner.|На ужин у нас рыба.|food
rice|n|рис|raɪs|райс|Rice is popular in Asia.|Рис популярен в Азии.|food
breakfast|n|завтрак|ˈbrekfəst|брэ́кфэст|I have breakfast at 8.|Я завтракаю в 8.|food|c:have breakfast;m:Без артикля: have breakfast, не have a breakfast
lunch|n|обед|lʌntʃ|ланч|Let's have lunch together.|Давай пообедаем вместе.|food
dinner|n|ужин|ˈdɪnə|ди́нэ|Dinner is ready!|Ужин готов!|food
eat|v|есть, кушать|iːt|и:т|What do you eat for lunch?|Что ты ешь на обед?|food|f:ate, eaten
drink|v|пить|drɪŋk|дринк|I drink a lot of water.|Я пью много воды.|food|f:drank, drunk
house|n|дом (здание)|haʊs|ха́ус|They live in a big house.|Они живут в большом доме.|home|m:house — здание, home — «дом» как место, где живёшь
home|n|дом (родной)|həʊm|хо́ум|I go home at six.|Я иду домой в шесть.|home|m:go home — без предлога to
room|n|комната|ruːm|ру:м|My room is small.|Моя комната маленькая.|home
kitchen|n|кухня|ˈkɪtʃɪn|ки́чин|Mum is in the kitchen.|Мама на кухне.|home
bedroom|n|спальня|ˈbedruːm|бэ́друм|The bedroom is upstairs.|Спальня наверху.|home
table|n|стол|ˈteɪbl|тэ́йбл|The keys are on the table.|Ключи на столе.|home
chair|n|стул|tʃeə|чэ́э|Sit on this chair.|Садись на этот стул.|home
bed|n|кровать|bed|бэд|I go to bed at eleven.|Я ложусь спать в одиннадцать.|home|c:go to bed, make the bed
door|n|дверь|dɔː|до:|Please close the door.|Закрой, пожалуйста, дверь.|home
window|n|окно|ˈwɪndəʊ|уи́ндоу|Open the window, please.|Открой окно, пожалуйста.|home
shirt|n|рубашка|ʃɜːt|шё:т|He is wearing a white shirt.|На нём белая рубашка.|clothes
dress|n|платье|dres|дрэс|What a beautiful dress!|Какое красивое платье!|clothes
shoes|n|обувь, туфли|ʃuːz|шу:з|These shoes are new.|Эти туфли новые.|clothes
jacket|n|куртка, пиджак|ˈdʒækɪt|джэ́кит|Take your jacket, it's cold.|Возьми куртку, холодно.|clothes
trousers|n|брюки|ˈtraʊzəz|тра́узэз|My trousers are black.|Мои брюки чёрные.|clothes|s:pants (US);m:Всегда мн. число: my trousers are
hat|n|шляпа, шапка|hæt|хэт|Put on your hat.|Надень шапку.|clothes
wear|v|носить (одежду)|weə|уэ́э|I wear glasses.|Я ношу очки.|clothes|f:wore, worn;m:wear — носить на себе, carry — нести в руках
wake up|phr|просыпаться|weɪk ʌp|уэйк ап|I wake up at seven.|Я просыпаюсь в семь.|routine|f:woke up, woken up
get up|phr|вставать|ɡet ʌp|гэт ап|I get up early.|Я встаю рано.|routine
work|v|работать|wɜːk|уё:к|She works in an office.|Она работает в офисе.|routine|m:work — также «работа» (неисчисляемое): I have a lot of work
sleep|v|спать|sliːp|сли:п|Babies sleep a lot.|Младенцы много спят.|routine|f:slept, slept
wash|v|мыть, умываться|wɒʃ|уош|Wash your hands.|Помой руки.|routine
cook|v|готовить (еду)|kʊk|кук|My dad cooks very well.|Мой папа отлично готовит.|routine|m:cook — также «повар», а cooker — плита
go|v|идти, ехать|ɡəʊ|го́у|I go to school by bus.|Я езжу в школу на автобусе.|routine|f:went, gone
come|v|приходить|kʌm|кам|Come here, please.|Подойди сюда, пожалуйста.|routine|f:came, come
day|n|день|deɪ|дэй|Have a nice day!|Хорошего дня!|time
week|n|неделя|wiːk|уи:к|I work five days a week.|Я работаю пять дней в неделю.|time
month|n|месяц|mʌnθ|манс (θ — глухой межзубный)|My birthday is next month.|Мой день рождения в следующем месяце.|time
year|n|год|jɪə|йи́э|I am twenty years old.|Мне двадцать лет.|time|m:years old — не «have 20 years»
today|adv|сегодня|təˈdeɪ|тэдэ́й|It's hot today.|Сегодня жарко.|time
tomorrow|adv|завтра|təˈmɒrəʊ|тэмо́роу|See you tomorrow.|Увидимся завтра.|time
yesterday|adv|вчера|ˈjestədeɪ|йе́стэдэй|I was at home yesterday.|Вчера я был дома.|time
morning|n|утро|ˈmɔːnɪŋ|мо́:нинг|Good morning!|Доброе утро!|time|c:in the morning
evening|n|вечер|ˈiːvnɪŋ|и́:внинг|We watch TV in the evening.|Вечером мы смотрим телевизор.|time
night|n|ночь|naɪt|найт|Good night!|Спокойной ночи!|time|c:at night
hour|n|час|ˈaʊə|а́уэ (h не читается)|The lesson is one hour long.|Урок длится час.|time|m:an hour — с артиклем an, т.к. h немая
weather|n|погода|ˈweðə|уэ́зэ|The weather is nice today.|Сегодня хорошая погода.|weather|m:Неисчисляемое: не «a nice weather»
sun|n|солнце|sʌn|сан|The sun is shining.|Светит солнце.|weather
rain|n|дождь|reɪn|рэйн|I love the rain.|Я люблю дождь.|weather|c:heavy rain
snow|n|снег|snəʊ|сно́у|There is a lot of snow.|Много снега.|weather
hot|adj|жаркий, горячий|hɒt|хот|It's very hot in summer.|Летом очень жарко.|weather|a:cold
cold|adj|холодный|kəʊld|ко́улд|The water is cold.|Вода холодная.|weather|a:hot
red|adj|красный|red|рэд|I have a red car.|У меня красная машина.|colour
blue|adj|синий, голубой|bluː|блу:|The sky is blue.|Небо голубое.|colour
green|adj|зелёный|ɡriːn|гри:н|Green is my favourite colour.|Зелёный — мой любимый цвет.|colour
yellow|adj|жёлтый|ˈjeləʊ|йе́лоу|Bananas are yellow.|Бананы жёлтые.|colour
black|adj|чёрный|blæk|блэк|She has black hair.|У неё чёрные волосы.|colour|a:white
white|adj|белый|waɪt|уайт|Snow is white.|Снег белый.|colour
dog|n|собака|dɒɡ|дог|My dog is very friendly.|Моя собака очень дружелюбная.|animals
cat|n|кошка|kæt|кэт|The cat is on the sofa.|Кошка на диване.|animals
bird|n|птица|bɜːd|бё:д|A bird is singing.|Поёт птица.|animals
horse|n|лошадь|hɔːs|хо:с|Can you ride a horse?|Ты умеешь ездить верхом?|animals
music|n|музыка|ˈmjuːzɪk|мью́:зик|I listen to music every day.|Я слушаю музыку каждый день.|hobby|c:listen to music
book|n|книга|bʊk|бук|This book is interesting.|Эта книга интересная.|hobby|c:read a book
game|n|игра|ɡeɪm|гэйм|Let's play a game.|Давай поиграем.|hobby
play|v|играть|pleɪ|плэй|I play football on Sundays.|Я играю в футбол по воскресеньям.|hobby|m:play football (без the), play the piano (с the)
read|v|читать|riːd|ри:д|I read before bed.|Я читаю перед сном.|hobby|f:read /red/, read /red/
swim|v|плавать|swɪm|суим|Can you swim?|Ты умеешь плавать?|hobby|f:swam, swum
like|v|нравиться, любить|laɪk|лайк|I like chocolate.|Я люблю шоколад.|hobby|m:like + -ing: I like reading
love|v|любить|lʌv|лав|I love my family.|Я люблю свою семью.|hobby
school|n|школа|skuːl|ску:л|My school is near my house.|Моя школа рядом с домом.|school|c:at school, go to school
teacher|n|учитель|ˈtiːtʃə|ти́:чэ|Our teacher is very kind.|Наш учитель очень добрый.|school
student|n|студент, ученик|ˈstjuːdnt|стью́:дэнт|I am a student.|Я студент.|school
pen|n|ручка|pen|пэн|Can I borrow your pen?|Можно взять твою ручку?|school
learn|v|учить, изучать|lɜːn|лё:н|I learn English.|Я изучаю английский.|school|m:learn — учиться самому, teach — учить кого-то
write|v|писать|raɪt|райт|Write your name here.|Напиши здесь своё имя.|school|f:wrote, written
city|n|город|ˈsɪti|си́ти|London is a big city.|Лондон — большой город.|city|f:cities
street|n|улица|striːt|стри:т|I live on Green Street.|Я живу на Грин-стрит.|city|c:on the street
shop|n|магазин|ʃɒp|шоп|The shop opens at nine.|Магазин открывается в девять.|shop|s:store (US)
park|n|парк|pɑːk|па:к|Let's go to the park.|Пойдём в парк.|city
hospital|n|больница|ˈhɒspɪtl|хо́спитл|She is in hospital.|Она в больнице.|health
bank|n|банк|bæŋk|бэнк|The bank is closed today.|Банк сегодня закрыт.|city
car|n|машина, автомобиль|kɑː|ка:|My car is old.|Моя машина старая.|transport
bus|n|автобус|bʌs|бас|I take the bus to work.|Я езжу на работу на автобусе.|transport|c:by bus, take the bus
train|n|поезд|treɪn|трэйн|The train leaves at 10.|Поезд отправляется в 10.|transport
plane|n|самолёт|pleɪn|плэйн|We go by plane.|Мы летим самолётом.|transport
bike|n|велосипед|baɪk|байк|I ride my bike to school.|Я езжу в школу на велосипеде.|transport|s:bicycle
buy|v|покупать|baɪ|бай|I want to buy a new phone.|Я хочу купить новый телефон.|shop|f:bought, bought
money|n|деньги|ˈmʌni|ма́ни|I don't have much money.|У меня мало денег.|shop|m:Неисчисляемое: money is, не «money are»
price|n|цена|praɪs|прайс|What's the price of this bag?|Какая цена у этой сумки?|shop
cheap|adj|дешёвый|tʃiːp|чи:п|This hotel is cheap.|Этот отель дешёвый.|shop|a:expensive
expensive|adj|дорогой|ɪkˈspensɪv|икспэ́нсив|London is expensive.|Лондон дорогой.|shop|a:cheap
head|n|голова|hed|хэд|I have a headache.|У меня болит голова.|health
doctor|n|врач|ˈdɒktə|до́ктэ|You should see a doctor.|Тебе стоит сходить к врачу.|health
ill|adj|больной|ɪl|ил|I feel ill today.|Мне сегодня плохо.|health|s:sick
hotel|n|отель, гостиница|həʊˈtel|хоутэ́л|Our hotel is near the sea.|Наш отель у моря.|travel|m:Ударение на второй слог
holiday|n|отпуск, каникулы|ˈhɒlədeɪ|хо́лэдэй|We are on holiday.|Мы в отпуске.|travel|s:vacation (US);c:go on holiday
country|n|страна|ˈkʌntri|ка́нтри|Kazakhstan is a big country.|Казахстан — большая страна.|countries|f:countries
English|adj|английский|ˈɪŋɡlɪʃ|и́нглиш|I speak English.|Я говорю по-английски.|countries|m:Языки и национальности пишутся с заглавной буквы
job|n|работа, должность|dʒɒb|джоб|I love my job.|Я люблю свою работу.|jobs|m:job — исчисляемое (a job), work — неисчисляемое
nurse|n|медсестра, медбрат|nɜːs|нё:с|My aunt is a nurse.|Моя тётя — медсестра.|jobs
driver|n|водитель|ˈdraɪvə|дра́йвэ|He is a taxi driver.|Он таксист.|jobs
one|num|один|wʌn|уан|I have one cat.|У меня одна кошка.|numbers
three|num|три|θriː|сри: (θ — язык между зубами)|Three plus two is five.|Три плюс два — пять.|numbers|m:θ — не «с» и не «ф»: кончик языка между зубами
twenty|num|двадцать|ˈtwenti|туэ́нти|She is twenty.|Ей двадцать.|numbers
hundred|num|сто|ˈhʌndrəd|ха́ндрэд|A hundred people came.|Пришло сто человек.|numbers|m:two hundred — без -s
big|adj|большой|bɪɡ|биг|It's a big dog.|Это большая собака.|home|a:small;s:large
small|adj|маленький|smɔːl|смо:л|I live in a small town.|Я живу в маленьком городе.|home|a:big
good|adj|хороший|ɡʊd|гуд|This is a good idea.|Это хорошая идея.|greet|f:better, best;a:bad
bad|adj|плохой|bæd|бэд|The weather is bad.|Погода плохая.|weather|f:worse, worst;a:good
new|adj|новый|njuː|нью:|I have a new job.|У меня новая работа.|shop|a:old
old|adj|старый|əʊld|о́улд|My grandfather is old.|Мой дедушка старый.|family|a:new, young
happy|adj|счастливый, довольный|ˈhæpi|хэ́пи|I am very happy.|Я очень счастлив.|greet|a:sad
want|v|хотеть|wɒnt|уонт|I want a cup of tea.|Я хочу чашку чая.|shop|m:want to do: I want to go (не «I want go»)
have|v|иметь|hæv|хэв|I have two sisters.|У меня две сестры.|family|f:had, had
know|v|знать|nəʊ|но́у|I don't know.|Я не знаю.|school|f:knew, known;m:k не читается
speak|v|говорить|spiːk|спи:к|Do you speak English?|Вы говорите по-английски?|countries|f:spoke, spoken
`;
VOCAB_RAW.A2 = `
travel|v|путешествовать|ˈtrævl|трэ́вл|I love to travel by train.|Я люблю путешествовать на поезде.|travel2|c:travel abroad;m:travel — глагол/неисч., trip — конкретная поездка
trip|n|поездка|trɪp|трип|We had a great trip to Turkey.|У нас была отличная поездка в Турцию.|travel2|c:business trip, take a trip
passport|n|паспорт|ˈpɑːspɔːt|па́:спо:т|Don't forget your passport.|Не забудь паспорт.|travel2
luggage|n|багаж|ˈlʌɡɪdʒ|ла́гидж|My luggage is too heavy.|Мой багаж слишком тяжёлый.|travel2|s:baggage;m:Неисчисляемое: не «luggages»
ticket|n|билет|ˈtɪkɪt|ти́кит|I booked two tickets online.|Я забронировал два билета онлайн.|travel2|c:return ticket, one-way ticket
abroad|adv|за границей, за границу|əˈbrɔːd|эбро́:д|She works abroad.|Она работает за границей.|travel2|m:go abroad — без to
book|v|бронировать|bʊk|бук|I need to book a hotel.|Мне нужно забронировать отель.|travel2
arrive|v|прибывать|əˈraɪv|эра́йв|We arrived in Paris at night.|Мы прибыли в Париж ночью.|travel2|m:arrive in (город/страна), arrive at (здание); не «arrive to»
leave|v|уезжать, покидать; оставлять|liːv|ли:в|The train leaves at six.|Поезд уходит в шесть.|travel2|f:left, left
career|n|карьера|kəˈrɪə|кэри́э|She wants a career in medicine.|Она хочет карьеру в медицине.|work2|m:Ударение на второй слог
salary|n|зарплата|ˈsæləri|сэ́лэри|The salary is good.|Зарплата хорошая.|work2|s:wages
manager|n|менеджер, руководитель|ˈmænɪdʒə|мэ́ниджэ|Talk to the manager.|Поговорите с менеджером.|work2
interview|n|собеседование, интервью|ˈɪntəvjuː|и́нтэвью:|I have a job interview tomorrow.|Завтра у меня собеседование.|work2
colleague|n|коллега|ˈkɒliːɡ|ко́ли:г|My colleagues are friendly.|Мои коллеги дружелюбные.|work2
experience|n|опыт|ɪkˈspɪəriəns|икспи́эриэнс|Do you have any experience?|У вас есть опыт?|work2|m:опыт работы — неисч.: experience; «случай» — исч.: an experience
computer|n|компьютер|kəmˈpjuːtə|кэмпью́:тэ|I work on a computer all day.|Я весь день работаю за компьютером.|tech
download|v|скачивать|ˌdaʊnˈləʊd|даунло́уд|Download the app for free.|Скачайте приложение бесплатно.|tech
password|n|пароль|ˈpɑːswɜːd|па́:суё:д|Never share your password.|Никогда не сообщайте свой пароль.|tech
website|n|веб-сайт|ˈwebsaɪt|уэ́бсайт|Check our website.|Посмотрите наш сайт.|tech
message|n|сообщение|ˈmesɪdʒ|мэ́сидж|I sent you a message.|Я отправил тебе сообщение.|comm|c:send a message, leave a message
call|v|звонить|kɔːl|ко:л|Call me later.|Позвони мне позже.|comm|m:call somebody — без предлога: call me, не «call to me»
answer|v|отвечать|ˈɑːnsə|а́:нсэ|Please answer the question.|Пожалуйста, ответь на вопрос.|comm|m:answer the question — без to
explain|v|объяснять|ɪkˈspleɪn|икспле́йн|Can you explain this rule to me?|Можешь объяснить мне это правило?|comm|m:explain something to somebody, не «explain me»
relationship|n|отношения|rɪˈleɪʃnʃɪp|рилэ́йшншип|They have a good relationship.|У них хорошие отношения.|rel
married|adj|женатый, замужняя|ˈmærid|мэ́рид|They got married last year.|Они поженились в прошлом году.|rel|c:get married to somebody;m:married to, не «married with»
boyfriend|n|парень (бойфренд)|ˈbɔɪfrend|бо́йфрэнд|Her boyfriend is Italian.|Её парень — итальянец.|rel
angry|adj|сердитый, злой|ˈæŋɡri|э́нгри|Why are you angry?|Почему ты злишься?|emo|c:angry with somebody, angry about something
worried|adj|обеспокоенный|ˈwʌrid|уа́рид|I'm worried about the exam.|Я переживаю из-за экзамена.|emo|c:worried about
tired|adj|уставший|ˈtaɪəd|та́йэд|I'm too tired to cook.|Я слишком устал, чтобы готовить.|emo
bored|adj|скучающий|bɔːd|бо:д|I'm bored. Let's go out.|Мне скучно. Пойдём куда-нибудь.|emo|m:I'm bored — мне скучно; I'm boring — я скучный человек!
surprised|adj|удивлённый|səˈpraɪzd|сэпра́йзд|I was surprised by the news.|Я был удивлён новостью.|emo
afraid|adj|испуганный|əˈfreɪd|эфрэ́йд|She is afraid of spiders.|Она боится пауков.|emo|c:afraid of;s:scared
healthy|adj|здоровый, полезный|ˈhelθi|хэ́лси|Vegetables are healthy.|Овощи полезны.|life|a:unhealthy
exercise|n|упражнение, физкультура|ˈeksəsaɪz|э́ксэсайз|Exercise is good for you.|Физические упражнения полезны.|life|c:do exercise, take exercise
diet|n|рацион, диета|ˈdaɪət|да́йэт|I'm on a diet.|Я на диете.|life|c:a healthy diet, go on a diet
pain|n|боль|peɪn|пэйн|I have a pain in my back.|У меня болит спина.|life
medicine|n|лекарство; медицина|ˈmedsn|мэ́дсн|Take this medicine twice a day.|Принимайте это лекарство дважды в день.|life
exam|n|экзамен|ɪɡˈzæm|игзэ́м|I passed the exam!|Я сдал экзамен!|edu|c:pass/fail an exam, take an exam;m:«сдавать» = take, «сдать» = pass
subject|n|предмет (учебный)|ˈsʌbdʒɪkt|са́бджикт|Maths is my favourite subject.|Математика — мой любимый предмет.|edu
university|n|университет|ˌjuːnɪˈvɜːsəti|ю:нивё́:сэти|She studies at university.|Она учится в университете.|edu|m:a university — с a, т.к. начинается со звука /j/
mountain|n|гора|ˈmaʊntən|ма́унтэн|We climbed a mountain.|Мы поднялись на гору.|nature
river|n|река|ˈrɪvə|ри́вэ|The river is very wide.|Река очень широкая.|nature
forest|n|лес|ˈfɒrɪst|фо́рист|There are bears in the forest.|В лесу есть медведи.|nature
beach|n|пляж|biːtʃ|би:ч|Let's go to the beach.|Пойдём на пляж.|nature
island|n|остров|ˈaɪlənd|а́йлэнд|They live on an island.|Они живут на острове.|nature|m:s не читается
film|n|фильм|fɪlm|филм|Did you see the new film?|Ты видел новый фильм?|ent|s:movie (US)
concert|n|концерт|ˈkɒnsət|ко́нсэт|We went to a rock concert.|Мы ходили на рок-концерт.|ent
ticket office|n|касса|ˈtɪkɪt ˌɒfɪs|ти́кит офис|Buy tickets at the ticket office.|Купите билеты в кассе.|ent
match|n|матч|mætʃ|мэч|Did you watch the match?|Ты смотрел матч?|sport
team|n|команда|tiːm|ти:м|Our team won!|Наша команда выиграла!|sport
win|v|выигрывать|wɪn|уин|Who won the game?|Кто выиграл игру?|sport|f:won, won;a:lose;m:win a game, beat a person
lose|v|проигрывать; терять|luːz|лу:з|I lost my keys.|Я потерял ключи.|sport|f:lost, lost;m:Не путать с loose /luːs/ — свободный
spend|v|тратить; проводить (время)|spend|спэнд|I spend a lot on food.|Я много трачу на еду.|money|f:spent, spent;c:spend time
save|v|копить; спасать|seɪv|сэйв|I'm saving money for a car.|Я коплю деньги на машину.|money
pay|v|платить|peɪ|пэй|Can I pay by card?|Можно оплатить картой?|money|f:paid, paid;m:pay for something: pay for the ticket
cash|n|наличные|kæʃ|кэш|Do you have any cash?|У тебя есть наличные?|money
borrow|v|брать взаймы|ˈbɒrəʊ|бо́роу|Can I borrow your pen?|Можно одолжить твою ручку?|money|m:borrow — брать, lend — давать: Can you lend me?
clean|v|убирать, чистить|kliːn|кли:н|I clean my room on Saturdays.|Я убираю комнату по субботам.|house2
wash up|phr|мыть посуду|wɒʃ ˈʌp|уош ап|I'll wash up after dinner.|Я помою посуду после ужина.|house2|s:do the washing-up
neighbour|n|сосед|ˈneɪbə|нэ́йбэ|Our neighbours are noisy.|Наши соседи шумные.|city2|m:gh не читается; US: neighbor
traffic|n|движение, пробки|ˈtræfɪk|трэ́фик|There's a lot of traffic today.|Сегодня большие пробки.|city2|c:traffic jam;m:Неисчисляемое
crowded|adj|переполненный|ˈkraʊdɪd|кра́удид|The metro is crowded.|Метро переполнено.|city2
plan|n|план|plæn|плэн|What are your plans for the weekend?|Какие у тебя планы на выходные?|future|c:make plans
hope|v|надеяться|həʊp|хо́уп|I hope to see you soon.|Надеюсь скоро увидеться.|future
probably|adv|вероятно|ˈprɒbəbli|про́бэбли|I'll probably stay at home.|Я, вероятно, останусь дома.|future
remember|v|помнить|rɪˈmembə|римэ́мбэ|I remember my first day at school.|Я помню свой первый день в школе.|past|m:remember to do (не забыть сделать) / remember doing (помнить, что сделал)
forget|v|забывать|fəˈɡet|фэгэ́т|Don't forget to call me.|Не забудь мне позвонить.|past|f:forgot, forgotten
ago|adv|тому назад|əˈɡəʊ|эго́у|I met him two years ago.|Я встретил его два года назад.|past|m:ago ставится после периода и только с Past Simple
already|adv|уже|ɔːlˈredi|о:лрэ́ди|I've already eaten.|Я уже поел.|past
decide|v|решать|dɪˈsaɪd|диса́йд|We decided to stay.|Мы решили остаться.|future|c:decide to do
choose|v|выбирать|tʃuːz|чу:з|Choose the right answer.|Выберите правильный ответ.|future|f:chose, chosen
believe|v|верить|bɪˈliːv|били́:в|I don't believe you.|Я тебе не верю.|comm|c:believe in
important|adj|важный|ɪmˈpɔːtnt|импо́:тэнт|This is very important.|Это очень важно.|work2
difficult|adj|трудный|ˈdɪfɪkəlt|ди́фикэлт|The test was difficult.|Тест был трудным.|edu|s:hard;a:easy
easy|adj|лёгкий|ˈiːzi|и́:зи|This exercise is easy.|Это упражнение лёгкое.|edu|a:difficult
quiet|adj|тихий|ˈkwaɪət|куа́йэт|It's a quiet street.|Это тихая улица.|city2|m:Не путать с quite /kwaɪt/ — довольно
dangerous|adj|опасный|ˈdeɪndʒərəs|дэ́йнджэрэс|Swimming here is dangerous.|Здесь опасно плавать.|nature|a:safe
famous|adj|знаменитый|ˈfeɪməs|фэ́ймэс|He's a famous singer.|Он знаменитый певец.|ent|c:famous for
`;
VOCAB_RAW.B1 = `
achieve|v|достигать|əˈtʃiːv|эчи́:в|She achieved her goals.|Она достигла своих целей.|personal|c:achieve a goal, achieve success
opportunity|n|возможность|ˌɒpəˈtjuːnəti|опэтью́:нэти|This is a great opportunity.|Это отличная возможность.|personal|c:take an opportunity, miss an opportunity
challenge|n|вызов, трудная задача|ˈtʃælɪndʒ|чэ́линдж|Learning a language is a challenge.|Изучение языка — это вызов.|personal|c:face a challenge
improve|v|улучшать(ся)|ɪmˈpruːv|импру́:в|I want to improve my English.|Я хочу улучшить свой английский.|personal
confident|adj|уверенный|ˈkɒnfɪdənt|ко́нфидэнт|She feels confident now.|Теперь она чувствует себя уверенно.|personal|c:confident about/in
memory|n|воспоминание, память|ˈmeməri|мэ́мэри|I have good memories of school.|У меня хорошие воспоминания о школе.|personal
research|n|исследование|rɪˈsɜːtʃ|рисё́:ч|Scientists did research on sleep.|Учёные провели исследование сна.|science|m:Обычно неисчисляемое: do research, не «a research»
experiment|n|эксперимент|ɪkˈsperɪmənt|икспэ́римэнт|We did an experiment in class.|Мы провели эксперимент на уроке.|science|c:carry out an experiment
invention|n|изобретение|ɪnˈvenʃn|инвэ́ншн|The phone is a great invention.|Телефон — великое изобретение.|science|f:invent, inventor
device|n|устройство|dɪˈvaɪs|дива́йс|Turn off all electronic devices.|Выключите все электронные устройства.|science
environment|n|окружающая среда|ɪnˈvaɪrənmənt|инва́йрэнмэнт|We must protect the environment.|Мы должны защищать окружающую среду.|env|m:the environment — с артиклем в значении «природа»
pollution|n|загрязнение|pəˈluːʃn|пэлу́:шн|Air pollution is a big problem.|Загрязнение воздуха — большая проблема.|env|f:pollute
climate|n|климат|ˈklaɪmət|кла́ймэт|The climate is changing.|Климат меняется.|env|c:climate change
recycle|v|перерабатывать|ˌriːˈsaɪkl|ри:са́йкл|We recycle plastic and paper.|Мы перерабатываем пластик и бумагу.|env
waste|n|отходы; трата|weɪst|уэ́йст|It's a waste of time.|Это пустая трата времени.|env|c:a waste of time/money
energy|n|энергия|ˈenədʒi|э́нэджи|Solar energy is clean.|Солнечная энергия — чистая.|env
tradition|n|традиция|trəˈdɪʃn|трэди́шн|It's a family tradition.|Это семейная традиция.|culture|f:traditional
custom|n|обычай|ˈkʌstəm|ка́стэм|It's an old local custom.|Это старый местный обычай.|culture|m:customs — таможня
celebrate|v|праздновать|ˈselɪbreɪt|сэ́либрэйт|How do you celebrate New Year?|Как вы празднуете Новый год?|culture
belief|n|убеждение, вера|bɪˈliːf|били́:ф|People have different beliefs.|У людей разные убеждения.|culture
poverty|n|бедность|ˈpɒvəti|по́вэти|Millions live in poverty.|Миллионы живут в бедности.|social
unemployment|n|безработица|ˌʌnɪmˈplɔɪmənt|анимпло́ймэнт|Unemployment is rising.|Безработица растёт.|social
crime|n|преступность, преступление|kraɪm|крайм|Crime has fallen in the city.|Преступность в городе снизилась.|social|c:commit a crime
equal|adj|равный|ˈiːkwəl|и́:куэл|Everyone should have equal rights.|У всех должны быть равные права.|social
advertisement|n|реклама|ədˈvɜːtɪsmənt|эдвё́:тисмэнт|I saw an advertisement on TV.|Я увидел рекламу по телевизору.|media|s:advert, ad
journalist|n|журналист|ˈdʒɜːnəlɪst|джё́:нэлист|She works as a journalist.|Она работает журналистом.|media
article|n|статья|ˈɑːtɪkl|а́:тикл|I read an interesting article.|Я прочитал интересную статью.|media
broadcast|v|транслировать|ˈbrɔːdkɑːst|бро́:дка:ст|The match was broadcast live.|Матч транслировали в прямом эфире.|media|f:broadcast, broadcast
lecture|n|лекция|ˈlektʃə|лэ́кчэ|The lecture starts at ten.|Лекция начинается в десять.|uni|c:give/attend a lecture
degree|n|степень (учёная), диплом|dɪˈɡriː|дигри́:|She has a degree in law.|У неё диплом юриста.|uni|c:a degree in something
assignment|n|задание|əˈsaɪnmənt|эса́йнмэнт|I have to finish my assignment.|Мне нужно доделать задание.|uni
deadline|n|крайний срок|ˈdedlaɪn|дэ́длайн|The deadline is Friday.|Крайний срок — пятница.|uni|c:meet a deadline, miss a deadline
skill|n|навык|skɪl|скил|Communication is an important skill.|Общение — важный навык.|prof|c:develop skills
responsible|adj|ответственный|rɪˈspɒnsəbl|риспо́нсэбл|Who is responsible for this?|Кто за это отвечает?|prof|c:responsible for
promotion|n|повышение (по службе)|prəˈməʊʃn|прэмо́ушн|He got a promotion.|Его повысили.|prof
customer|n|клиент, покупатель|ˈkʌstəmə|ка́стэмэ|The customer is always right.|Клиент всегда прав.|business
profit|n|прибыль|ˈprɒfɪt|про́фит|The company made a profit.|Компания получила прибыль.|business|c:make a profit
company|n|компания|ˈkʌmpəni|ка́мпэни|He runs his own company.|Он руководит своей компанией.|business
behaviour|n|поведение|bɪˈheɪvjə|бихэ́йвйэ|His behaviour was strange.|Его поведение было странным.|psych|m:Неисчисляемое; US: behavior
personality|n|характер, личность|ˌpɜːsəˈnæləti|пё:сэнэ́лэти|She has a strong personality.|У неё сильный характер.|psych
stress|n|стресс|stres|стрэс|Exercise reduces stress.|Физнагрузка снижает стресс.|psych|f:stressful, stressed
anxious|adj|тревожный|ˈæŋkʃəs|э́нкшэс|I feel anxious before exams.|Я тревожусь перед экзаменами.|psych
symptom|n|симптом|ˈsɪmptəm|си́мптэм|What are your symptoms?|Какие у вас симптомы?|health2
recover|v|выздоравливать|rɪˈkʌvə|рика́вэ|He recovered quickly.|Он быстро поправился.|health2|c:recover from
commute|v|ездить на работу|kəˈmjuːt|кэмью́:т|I commute by train.|Я езжу на работу на поезде.|transport2
public transport|n|общественный транспорт|ˌpʌblɪk ˈtrænspɔːt|паблик трэ́нспо:т|Public transport is cheap here.|Общественный транспорт здесь дешёвый.|transport2
international|adj|международный|ˌɪntəˈnæʃnəl|интэнэ́шнл|It's an international company.|Это международная компания.|global
influence|n|влияние|ˈɪnfluəns|и́нфлуэнс|Parents have a big influence.|Родители оказывают большое влияние.|global|c:have an influence on
novel|n|роман|ˈnɒvl|но́вл|She wrote her first novel.|Она написала свой первый роман.|arts|m:novel — роман (книга), не «новелла»
exhibition|n|выставка|ˌeksɪˈbɪʃn|эксиби́шн|We went to an art exhibition.|Мы ходили на художественную выставку.|arts|m:h не читается
government|n|правительство|ˈɡʌvənmənt|га́вэнмэнт|The government made a new law.|Правительство приняло новый закон.|news
event|n|событие|ɪˈvent|ивэ́нт|It was the event of the year.|Это было событие года.|news
increase|v|увеличивать(ся)|ɪnˈkriːs|инкри́:с|Prices increased by 10%.|Цены выросли на 10%.|news|a:decrease;m:Глагол — ударение на 2-й слог, сущ. — на 1-й
reduce|v|сокращать|rɪˈdjuːs|ридью́:с|We need to reduce costs.|Нам нужно сократить расходы.|env|s:cut
suggest|v|предлагать|səˈdʒest|сэджэ́ст|I suggest going by train.|Я предлагаю поехать на поезде.|personal|m:suggest doing / suggest that…, не «suggest me to do»
avoid|v|избегать|əˈvɔɪd|эво́йд|Avoid eating late at night.|Избегайте поздней еды.|health2|m:avoid + -ing
consider|v|рассматривать, обдумывать|kənˈsɪdə|кэнси́дэ|I'm considering a new job.|Я рассматриваю новую работу.|prof|m:consider + -ing
however|adv|однако|haʊˈevə|хауэ́вэ|It was cheap. However, it was bad.|Это было дёшево. Однако плохо.|news
although|conj|хотя|ɔːlˈðəʊ|о:лзо́у|Although it rained, we went out.|Хотя шёл дождь, мы вышли.|news|m:Не используйте although и but в одном предложении
`;
