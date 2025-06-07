Event Management - Serverless funkcije (Supabase)
Opis projekta
Ta projekt implementira preprosto rešitev za upravljanje dogodkov s pomočjo serverless arhitekture in Supabase platforme. Uporabniki se lahko prijavijo in registrirajo na dogodke, prejmejo obvestilo ob uspešni prijavi, vse aktivnosti pa se beležijo v dnevnikih (logih).

Projekt je razvit v sklopu predmeta IT arhitekture in pokriva zahteve za implementacijo različnih dogodkov v obliki serverless funkcij.

Ključne funkcionalnosti
Avtentikacija uporabnika

Avtentikacija temelji na Supabase auth.users (JWT token).

Upravljanje dogodkov

Uporabnik lahko ustvari nov dogodek (vnos v tabelo events).

Registracija na dogodek

Uporabnik se lahko registrira na dogodek (vnos v tabelo registrations).

Obveščanje uporabnika

Po uspešni registraciji uporabnik prejme obvestilo (vnos v tabelo notifications).

Logiranje aktivnosti

Vse pomembnejše aktivnosti (prijave, registracije) se beležijo v tabelo logs.

Pregled uporabljenih dogodkov
Podatkovne spremembe: dogodki in registracije (insert v bazo)

Obveščanje: notifications (pošiljanje sporočila ob uspešni registraciji)

Logi: spremljanje vseh pomembnih aktivnosti

Uporabniški dogodki: registracija in prijava na dogodek

Baze in tabele
events (id, title, description, start_time, end_time, created_by, created_at, image_url)

registrations (id, event_id, user_id, created_at)

logs (id, user_id, action, details, created_at)

notifications (id, user_id, message, created_at)

auth.users (Supabase privzeta tabela za uporabnike)

Testiranje
Funkcionalnosti so bile testirane preko Postmana.

Dodani so bili screenshoti uspešnih in neuspešnih zahtevkov (glej priložene slike).

Navodila za uporabo (lokalno ali v Postmanu)
Pridobi JWT token iz Supabase (prijavi se kot uporabnik).

Pošiljaj zahteve na ustrezne Supabase endpoints (glej primere v Postmanu):

/events – dodajanje dogodkov

/registrations – prijava na dogodek

/notifications – prejem obvestil

/logs – spremljanje logov

Za vsako zahtevo je treba v header dodati:

Authorization: Bearer <JWT_TOKEN>

apikey: <SUPABASE_API_KEY>

Content-Type: application/json