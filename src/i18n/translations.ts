/**
 * Typed i18n dictionary. Every user-facing UI string lives here in both
 * languages — no hardcoded copy anywhere else in the app.
 *
 * Seed *content* (class names, plan names, trainer bios, quotes) is authored
 * bilingually in src/data/* using the `Localized` shape instead of here.
 */

export const translations = {
  no: {
    // nav
    'nav.home': 'Hjem',
    'nav.schedule': 'Timeplan',
    'nav.profile': 'Profil',

    // header / install
    'app.name': 'TMK Fitness',
    'app.tagline': 'Avaldsnes · Karmøy',
    'install.hint': 'Legg til på hjemskjerm',
    'install.action': 'Installer',
    'install.dismiss': 'Lukk',

    // update toast
    'update.title': 'Ny versjon tilgjengelig',
    'update.body': 'Oppdater for å få den nyeste versjonen.',
    'update.action': 'Oppdater',
    'update.offlineReady': 'Appen er klar til bruk offline.',

    // greetings (time of day)
    'greeting.morning': 'God morgen',
    'greeting.day': 'Hei',
    'greeting.evening': 'God kveld',

    // home
    'home.membership': 'Medlemskap',
    'home.nextClass': 'Neste time',
    'home.noNextClass': 'Ingen timer booket ennå',
    'home.noNextClassCta': 'Book din første time',
    'home.upcoming': 'Kommende timer',
    'home.upcomingEmpty': 'Du har ingen kommende timer.',
    'home.bookCta': 'Book en time',
    'home.motivation': 'Dagens motivasjon',
    'home.instructor': 'Instruktør',

    // countdown units
    'count.days': 'dager',
    'count.hours': 'timer',
    'count.minutes': 'min',
    'count.seconds': 'sek',
    'count.startsNow': 'Starter nå!',

    // schedule
    'schedule.title': 'Timeplan',
    'schedule.subtitle': 'Book din neste økt',
    'schedule.today': 'I dag',
    'schedule.spotsLeft': 'plasser igjen',
    'schedule.oneSpot': 'plass igjen',
    'schedule.full': 'Fullt',
    'schedule.booked': 'Booket',
    'schedule.free': 'Gratis for medlemmer',
    'schedule.empty': 'Ingen timer denne dagen.',
    'schedule.lowSpots': 'Få plasser',

    // booking sheet
    'sheet.details': 'Detaljer',
    'sheet.instructor': 'Instruktør',
    'sheet.when': 'Tidspunkt',
    'sheet.spots': 'Ledige plasser',
    'sheet.confirm': 'Bekreft booking',
    'sheet.confirming': 'Booker …',
    'sheet.success': 'Booket!',
    'sheet.successBody': 'Vi sees på trening.',
    'sheet.close': 'Lukk',
    'sheet.alreadyBooked': 'Du har allerede booket denne timen.',
    'sheet.cancel': 'Avbestill',
    'sheet.cancelled': 'Booking avbestilt',

    // profile
    'profile.title': 'Profil',
    'profile.member': 'Medlem',
    'profile.personalInfo': 'Personlig informasjon',
    'profile.firstName': 'Fornavn',
    'profile.lastName': 'Etternavn',
    'profile.phone': 'Telefonnummer',
    'profile.searchCountry': 'Søk land eller kode',
    'profile.plan': 'Ditt medlemskap',
    'profile.changePlan': 'Bytt plan',
    'profile.planExternalHint': 'Endre eller oppgrader medlemskapet via TMK sin innmelding.',
    'profile.goals': 'Månedens mål',
    'profile.monthlyGoal': 'Mål',
    'profile.goalDown': 'Reduser mål',
    'profile.goalUp': 'Øk mål',
    'profile.sessionsOf': 'av',
    'profile.sessions': 'økter',
    'profile.thisMonth': 'denne måneden',
    'profile.language': 'Språk',
    'profile.saved': 'Endringer lagret',
    'profile.save': 'Lagre endringer',

    // misc
    'common.today': 'I dag',
    'common.tomorrow': 'I morgen',
    'common.back': 'Tilbake',
    'common.all': 'Alle',
    'common.search': 'Søk',
    'common.viewAll': 'Se alle',
    'common.book': 'Book',
    'common.save': 'Lagre',
    'common.cancel': 'Avbryt',
    'common.delete': 'Slett',
    'common.min': 'min',
    'weekday.short.sun': 'Søn',

    // status
    'status.active': 'Aktiv',
    'status.frozen': 'Fryst',
    'status.expired': 'Utløpt',

    // login
    'login.welcome': 'Velkommen',
    'login.subtitle': 'Logg inn på TMK Fitness',
    'login.email': 'E-post',
    'login.password': 'Passord',
    'login.role': 'Logg inn som',
    'login.member': 'Medlem',
    'login.admin': 'Ansatt / Admin',
    'login.memberDesc': 'Book timer og følg treningen din',
    'login.adminDesc': 'Administrer senteret',
    'login.signIn': 'Logg inn',
    'login.demo': 'Demo — hvilket som helst passord fungerer',
    'login.error': 'Feil e-post eller passord',
    'login.demoHint': 'Demokontoer (passord: demo1234)',
    'login.signingIn': 'Logger inn …',

    // member nav / quick actions
    'nav.bookings': 'Mine timer',
    'home.quickActions': 'Snarveier',
    'home.trainers': 'Trenere',
    'home.treatments': 'Behandling',
    'home.contact': 'Kontakt',

    // class detail
    'classdetail.about': 'Om timen',
    'classdetail.upcoming': 'Kommende timer',
    'classdetail.trainer': 'Instruktør',
    'classdetail.noUpcoming': 'Ingen planlagte timer akkurat nå.',

    // trainers
    'trainers.title': 'Trenere',
    'trainers.subtitle': 'Møt teamet vårt',
    'trainer.specialties': 'Spesialiteter',
    'trainer.about': 'Om',
    'trainer.book': 'Book PT-time',

    // bookings
    'bookings.title': 'Mine timer',
    'bookings.upcoming': 'Kommende',
    'bookings.past': 'Tidligere',
    'bookings.empty': 'Du har ingen kommende timer.',
    'bookings.emptyPast': 'Ingen tidligere timer ennå.',
    'bookings.browse': 'Se timeplan',
    'bookings.completed': 'Fullført',
    'bookings.checkIn': 'Sjekk inn',

    // treatment
    'treatment.title': 'Behandling & PT',
    'treatment.subtitle': 'Bestill time hos Michel',
    'treatment.duration': 'Varighet',
    'treatment.with': 'Hos',
    'treatment.choose': 'Velg tidspunkt',
    'treatment.book': 'Bestill time',
    'treatment.booked': 'Time bestilt!',

    // membership
    'membership.title': 'Medlemskap',
    'membership.current': 'Ditt medlemskap',
    'membership.perks': 'Dette er inkludert',
    'membership.perk1': 'Fri tilgang til alle spinningtimer',
    'membership.perk2': 'Gratis sirkeltrening for pensjonister/uføre',
    'membership.perk3': 'Book direkte i appen — når som helst',
    'membership.allPlans': 'Alle medlemskap',
    'membership.upgrade': 'Oppgrader',
    'membership.selected': 'Valgt',

    // contact
    'contact.title': 'Kontakt & senter',
    'contact.address': 'Adresse',
    'contact.phone': 'Telefon',
    'contact.email': 'E-post',
    'contact.hours': 'Åpningstider',
    'contact.directions': 'Vis veibeskrivelse',
    'contact.follow': 'Følg oss',

    // ---- ADMIN ----
    'admin.console': 'Adminkonsoll',
    'admin.signedInAs': 'Innlogget som',
    'admin.switchToMember': 'Bytt til medlemsvisning',
    'admin.logout': 'Logg ut',
    'admin.nav.dashboard': 'Oversikt',
    'admin.nav.timetable': 'Timeplan',
    'admin.nav.bookings': 'Bookinger',
    'admin.nav.members': 'Medlemmer',
    'admin.nav.plans': 'Medlemskap',

    // admin dashboard
    'admin.dash.title': 'Oversikt',
    'admin.dash.welcome': 'God morgen',
    'admin.dash.activeMembers': 'Aktive medlemmer',
    'admin.dash.bookingsWeek': 'Bookinger denne uken',
    'admin.dash.fillRate': 'Fyllingsgrad',
    'admin.dash.revenueMonth': 'Månedlig omsetning',
    'admin.dash.today': 'I dag på senteret',
    'admin.dash.noToday': 'Ingen timer i dag.',
    'admin.dash.recent': 'Nye medlemmer',
    'admin.dash.byPlan': 'Fordeling på medlemskap',
    'admin.dash.vsWeek': 'mot forrige uke',
    'admin.dash.booked': 'booket',

    // admin timetable
    'admin.tt.title': 'Timeplan',
    'admin.tt.subtitle': 'Administrer timer og økter',
    'admin.tt.add': 'Ny time',
    'admin.tt.edit': 'Rediger time',
    'admin.tt.new': 'Ny time',
    'admin.tt.class': 'Klasse',
    'admin.tt.chooseClass': 'Velg klasse …',
    'admin.tt.chooseInstructor': 'Velg instruktør …',
    'admin.tt.day': 'Dag',
    'admin.tt.start': 'Start',
    'admin.tt.end': 'Slutt',
    'admin.tt.instructor': 'Instruktør',
    'admin.tt.capacity': 'Kapasitet',
    'admin.tt.spotsLeft': 'Ledige plasser',
    'admin.tt.free': 'Gratis for medlemmer',
    'admin.tt.delete': 'Slett time',
    'admin.tt.empty': 'Ingen timer denne dagen.',

    // admin bookings
    'admin.bk.title': 'Bookinger & oppmøte',
    'admin.bk.subtitle': 'Se hvem som kommer',
    'admin.bk.roster': 'Deltakerliste',
    'admin.bk.checkIn': 'Sjekk inn',
    'admin.bk.checkedIn': 'Sjekket inn',
    'admin.bk.present': 'til stede',
    'admin.bk.noBookings': 'Ingen bookinger på denne timen.',
    'admin.bk.selectClass': 'Velg en time for å se deltakerlisten',
    'admin.bk.filled': 'fylt',

    // admin members
    'admin.mb.title': 'Medlemmer',
    'admin.mb.subtitle': 'Administrer medlemskap',
    'admin.mb.add': 'Nytt medlem',
    'admin.mb.edit': 'Rediger medlem',
    'admin.mb.new': 'Nytt medlem',
    'admin.mb.firstName': 'Fornavn',
    'admin.mb.lastName': 'Etternavn',
    'admin.mb.email': 'E-post',
    'admin.mb.phone': 'Telefon',
    'admin.mb.plan': 'Medlemskap',
    'admin.mb.status': 'Status',
    'admin.mb.joined': 'Medlem siden',
    'admin.mb.search': 'Søk medlem …',
    'admin.mb.delete': 'Slett medlem',
    'admin.mb.count': 'medlemmer',
    'admin.mb.none': 'Ingen medlemmer funnet.',

    // admin plans
    'admin.pl.title': 'Medlemskap',
    'admin.pl.subtitle': 'Priser og pakker',
    'admin.pl.members': 'medlemmer',
    'admin.pl.revenue': 'mnd. omsetning',
    'admin.pl.featured': 'Mest valgt',

    // ---- ENGAGEMENT / SOCIAL ----
    'nav.community': 'Fellesskap',
    'community.title': 'Fellesskap',
    'community.subtitle': 'Sterkere sammen',

    // streak
    'streak.title': 'Din streak',
    'streak.weeks': 'uker på rad',
    'streak.best': 'Beste',
    'streak.thisWeek': 'Denne uken',
    'streak.keepGoing': 'Book neste økt og hold streaken i live!',

    // challenge
    'challenge.section': 'Månedens utfordring',
    'challenge.endsIn': 'Slutter om',
    'challenge.days': 'dager',
    'challenge.join': 'Bli med',
    'challenge.joined': 'Du er med',
    'challenge.participants': 'deltakere',
    'challenge.your': 'Ditt bidrag',
    'challenge.toGoal': 'igjen til målet',

    // leaderboard
    'leaderboard.title': 'Toppliste denne måneden',
    'leaderboard.you': 'Deg',
    'leaderboard.sessions': 'økter',
    'leaderboard.yourRank': 'Din plassering',

    // feed
    'feed.title': 'Aktivitet',
    'feed.cheer': 'Heia!',
    'feed.booked': 'booket',
    'feed.checkin': 'sjekket inn på',
    'feed.empty': 'Ingen aktivitet ennå.',

    // badges
    'badges.title': 'Utmerkelser',
    'badges.earned': 'Oppnådd',
    'badges.locked': 'Låst',

    // referral
    'referral.title': 'Inviter en venn',
    'referral.body': 'Tren bedre sammen. Del koden din — dere får begge en belønning.',
    'referral.reward': '1 måned gratis for hver venn som blir medlem',
    'referral.code': 'Din kode',
    'referral.copy': 'Kopier',
    'referral.copied': 'Kopiert!',
    'referral.share': 'Del',

    // home nudge / social proof
    'nudge.title': 'Vennene dine trener',
    'nudge.goingOne': 'er påmeldt',
    'nudge.goingMany': 'er påmeldt',
    'nudge.others': 'andre',
    'nudge.join': 'Bli med',
    'schedule.going': 'påmeldt',
    'streak.week': 'uke på rad',
    'sheet.friendGoing': 'venn er påmeldt',
    'sheet.friendsGoing': 'venner er påmeldt',

    // messaging
    'nav.messages': 'Meldinger',
    'messages.title': 'Meldinger',
    'messages.subtitle': 'Chat med trenerne dine',
    'messages.coaches': 'Trenere',
    'messages.empty': 'Ingen meldinger ennå. Si hei!',
    'messages.placeholder': 'Skriv en melding …',
    'messages.send': 'Send',
    'messages.reply': 'Vanligvis svar innen en time',

    // share
    'share.title': 'Del',
    'share.native': 'Del …',
    'share.copyLink': 'Kopier lenke',
    'share.copied': 'Kopiert!',
    'share.igHint': 'Bildetekst kopiert — lim inn på Instagram',

    // profile additions
    'profile.share': 'Del fremgangen din',
    'profile.changePhoto': 'Endre bilde',
    'trainer.message': 'Send melding',

    // messaging — recipients / inbox
    'messages.new': 'Ny melding',
    'messages.chooseRecipient': 'Hvem vil du sende til?',
    'messages.general': 'Resepsjon',
    'messages.generalDesc': 'Sendes til senteret — hvem som helst i staben svarer',
    'messages.noneMember': 'Ingen samtaler ennå. Start en ny melding!',
    'inbox.title': 'Innboks',
    'inbox.subtitle': 'Meldinger fra medlemmer',
    'inbox.empty': 'Ingen meldinger her.',
    'inbox.staff': 'Deg',
    'inbox.re': 'Ang.',

    // admin — trainers
    'admin.nav.inbox': 'Innboks',
    'admin.nav.trainers': 'Trenere',
    'admin.tr.title': 'Trenere',
    'admin.tr.subtitle': 'Administrer team og instruktører',
    'admin.tr.add': 'Ny trener',
    'admin.tr.edit': 'Rediger trener',
    'admin.tr.new': 'Ny trener',
    'admin.tr.delete': 'Slett trener',
    'admin.tr.name': 'Navn',
    'admin.tr.role': 'Rolle',
    'admin.tr.specialties': 'Spesialiteter',
    'admin.tr.bio': 'Om',
    'admin.tr.contactable': 'Medlemmer kan sende melding',
    'admin.tr.notContactable': 'Ikke kontaktbar',
  },

  en: {
    // nav
    'nav.home': 'Home',
    'nav.schedule': 'Schedule',
    'nav.profile': 'Profile',

    // header / install
    'app.name': 'TMK Fitness',
    'app.tagline': 'Avaldsnes · Karmøy',
    'install.hint': 'Add to home screen',
    'install.action': 'Install',
    'install.dismiss': 'Dismiss',

    // update toast
    'update.title': 'New version available',
    'update.body': 'Reload to get the latest version.',
    'update.action': 'Update',
    'update.offlineReady': 'App ready to work offline.',

    // greetings
    'greeting.morning': 'Good morning',
    'greeting.day': 'Hi',
    'greeting.evening': 'Good evening',

    // home
    'home.membership': 'Membership',
    'home.nextClass': 'Next class',
    'home.noNextClass': 'No classes booked yet',
    'home.noNextClassCta': 'Book your first class',
    'home.upcoming': 'Upcoming classes',
    'home.upcomingEmpty': 'You have no upcoming classes.',
    'home.bookCta': 'Book a class',
    'home.motivation': "Today's motivation",
    'home.instructor': 'Instructor',

    // countdown
    'count.days': 'days',
    'count.hours': 'hrs',
    'count.minutes': 'min',
    'count.seconds': 'sec',
    'count.startsNow': 'Starting now!',

    // schedule
    'schedule.title': 'Schedule',
    'schedule.subtitle': 'Book your next session',
    'schedule.today': 'Today',
    'schedule.spotsLeft': 'spots left',
    'schedule.oneSpot': 'spot left',
    'schedule.full': 'Full',
    'schedule.booked': 'Booked',
    'schedule.free': 'Free for members',
    'schedule.empty': 'No classes on this day.',
    'schedule.lowSpots': 'Few spots',

    // booking sheet
    'sheet.details': 'Details',
    'sheet.instructor': 'Instructor',
    'sheet.when': 'When',
    'sheet.spots': 'Available spots',
    'sheet.confirm': 'Confirm booking',
    'sheet.confirming': 'Booking …',
    'sheet.success': 'Booked!',
    'sheet.successBody': 'See you at the gym.',
    'sheet.close': 'Close',
    'sheet.alreadyBooked': "You've already booked this class.",
    'sheet.cancel': 'Cancel booking',
    'sheet.cancelled': 'Booking cancelled',

    // profile
    'profile.title': 'Profile',
    'profile.member': 'Member',
    'profile.personalInfo': 'Personal information',
    'profile.firstName': 'First name',
    'profile.lastName': 'Last name',
    'profile.phone': 'Phone number',
    'profile.searchCountry': 'Search country or code',
    'profile.plan': 'Your membership',
    'profile.changePlan': 'Change plan',
    'profile.planExternalHint': "Change or upgrade your membership via TMK's online sign-up.",
    'profile.goals': "This month's goal",
    'profile.monthlyGoal': 'Goal',
    'profile.goalDown': 'Decrease goal',
    'profile.goalUp': 'Increase goal',
    'profile.sessionsOf': 'of',
    'profile.sessions': 'sessions',
    'profile.thisMonth': 'this month',
    'profile.language': 'Language',
    'profile.saved': 'Changes saved',
    'profile.save': 'Save changes',

    // misc
    'common.today': 'Today',
    'common.tomorrow': 'Tomorrow',
    'common.back': 'Back',
    'common.all': 'All',
    'common.search': 'Search',
    'common.viewAll': 'View all',
    'common.book': 'Book',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.min': 'min',
    'weekday.short.sun': 'Sun',

    // status
    'status.active': 'Active',
    'status.frozen': 'Frozen',
    'status.expired': 'Expired',

    // login
    'login.welcome': 'Welcome',
    'login.subtitle': 'Sign in to TMK Fitness',
    'login.email': 'Email',
    'login.password': 'Password',
    'login.role': 'Sign in as',
    'login.member': 'Member',
    'login.admin': 'Staff / Admin',
    'login.memberDesc': 'Book classes and track your training',
    'login.adminDesc': 'Manage the gym',
    'login.signIn': 'Sign in',
    'login.demo': 'Demo — any password works',
    'login.error': 'Wrong email or password',
    'login.demoHint': 'Demo accounts (password: demo1234)',
    'login.signingIn': 'Signing in …',

    // member nav / quick actions
    'nav.bookings': 'My classes',
    'home.quickActions': 'Quick actions',
    'home.trainers': 'Trainers',
    'home.treatments': 'Treatment',
    'home.contact': 'Contact',

    // class detail
    'classdetail.about': 'About this class',
    'classdetail.upcoming': 'Upcoming sessions',
    'classdetail.trainer': 'Instructor',
    'classdetail.noUpcoming': 'No scheduled sessions right now.',

    // trainers
    'trainers.title': 'Trainers',
    'trainers.subtitle': 'Meet our team',
    'trainer.specialties': 'Specialties',
    'trainer.about': 'About',
    'trainer.book': 'Book a PT session',

    // bookings
    'bookings.title': 'My classes',
    'bookings.upcoming': 'Upcoming',
    'bookings.past': 'Past',
    'bookings.empty': 'You have no upcoming classes.',
    'bookings.emptyPast': 'No past classes yet.',
    'bookings.browse': 'Browse schedule',
    'bookings.completed': 'Completed',
    'bookings.checkIn': 'Check in',

    // treatment
    'treatment.title': 'Treatment & PT',
    'treatment.subtitle': 'Book a session with Michel',
    'treatment.duration': 'Duration',
    'treatment.with': 'With',
    'treatment.choose': 'Choose a time',
    'treatment.book': 'Book session',
    'treatment.booked': 'Session booked!',

    // membership
    'membership.title': 'Membership',
    'membership.current': 'Your membership',
    'membership.perks': "What's included",
    'membership.perk1': 'Unlimited access to all spin classes',
    'membership.perk2': 'Free senior/adapted circuit training',
    'membership.perk3': 'Book straight from the app — anytime',
    'membership.allPlans': 'All memberships',
    'membership.upgrade': 'Upgrade',
    'membership.selected': 'Selected',

    // contact
    'contact.title': 'Contact & gym',
    'contact.address': 'Address',
    'contact.phone': 'Phone',
    'contact.email': 'Email',
    'contact.hours': 'Opening hours',
    'contact.directions': 'Get directions',
    'contact.follow': 'Follow us',

    // ---- ADMIN ----
    'admin.console': 'Admin console',
    'admin.signedInAs': 'Signed in as',
    'admin.switchToMember': 'Switch to member view',
    'admin.logout': 'Log out',
    'admin.nav.dashboard': 'Dashboard',
    'admin.nav.timetable': 'Timetable',
    'admin.nav.bookings': 'Bookings',
    'admin.nav.members': 'Members',
    'admin.nav.plans': 'Plans',

    // admin dashboard
    'admin.dash.title': 'Dashboard',
    'admin.dash.welcome': 'Good morning',
    'admin.dash.activeMembers': 'Active members',
    'admin.dash.bookingsWeek': 'Bookings this week',
    'admin.dash.fillRate': 'Fill rate',
    'admin.dash.revenueMonth': 'Monthly revenue',
    'admin.dash.today': 'Today at the gym',
    'admin.dash.noToday': 'No classes today.',
    'admin.dash.recent': 'New members',
    'admin.dash.byPlan': 'Members by plan',
    'admin.dash.vsWeek': 'vs last week',
    'admin.dash.booked': 'booked',

    // admin timetable
    'admin.tt.title': 'Timetable',
    'admin.tt.subtitle': 'Manage classes and sessions',
    'admin.tt.add': 'New class',
    'admin.tt.edit': 'Edit class',
    'admin.tt.new': 'New class',
    'admin.tt.class': 'Class',
    'admin.tt.chooseClass': 'Select a class …',
    'admin.tt.chooseInstructor': 'Select an instructor …',
    'admin.tt.day': 'Day',
    'admin.tt.start': 'Start',
    'admin.tt.end': 'End',
    'admin.tt.instructor': 'Instructor',
    'admin.tt.capacity': 'Capacity',
    'admin.tt.spotsLeft': 'Spots left',
    'admin.tt.free': 'Free for members',
    'admin.tt.delete': 'Delete class',
    'admin.tt.empty': 'No classes on this day.',

    // admin bookings
    'admin.bk.title': 'Bookings & attendance',
    'admin.bk.subtitle': 'See who is coming',
    'admin.bk.roster': 'Roster',
    'admin.bk.checkIn': 'Check in',
    'admin.bk.checkedIn': 'Checked in',
    'admin.bk.present': 'present',
    'admin.bk.noBookings': 'No bookings for this class.',
    'admin.bk.selectClass': 'Select a class to see its roster',
    'admin.bk.filled': 'filled',

    // admin members
    'admin.mb.title': 'Members',
    'admin.mb.subtitle': 'Manage memberships',
    'admin.mb.add': 'New member',
    'admin.mb.edit': 'Edit member',
    'admin.mb.new': 'New member',
    'admin.mb.firstName': 'First name',
    'admin.mb.lastName': 'Last name',
    'admin.mb.email': 'Email',
    'admin.mb.phone': 'Phone',
    'admin.mb.plan': 'Plan',
    'admin.mb.status': 'Status',
    'admin.mb.joined': 'Member since',
    'admin.mb.search': 'Search member …',
    'admin.mb.delete': 'Delete member',
    'admin.mb.count': 'members',
    'admin.mb.none': 'No members found.',

    // admin plans
    'admin.pl.title': 'Plans',
    'admin.pl.subtitle': 'Prices and packages',
    'admin.pl.members': 'members',
    'admin.pl.revenue': 'monthly revenue',
    'admin.pl.featured': 'Most popular',

    // ---- ENGAGEMENT / SOCIAL ----
    'nav.community': 'Community',
    'community.title': 'Community',
    'community.subtitle': 'Stronger together',

    // streak
    'streak.title': 'Your streak',
    'streak.weeks': 'weeks in a row',
    'streak.best': 'Best',
    'streak.thisWeek': 'This week',
    'streak.keepGoing': 'Book your next session to keep the streak alive!',

    // challenge
    'challenge.section': "This month's challenge",
    'challenge.endsIn': 'Ends in',
    'challenge.days': 'days',
    'challenge.join': 'Join',
    'challenge.joined': "You're in",
    'challenge.participants': 'participants',
    'challenge.your': 'Your contribution',
    'challenge.toGoal': 'to the goal',

    // leaderboard
    'leaderboard.title': 'Leaderboard this month',
    'leaderboard.you': 'You',
    'leaderboard.sessions': 'sessions',
    'leaderboard.yourRank': 'Your rank',

    // feed
    'feed.title': 'Activity',
    'feed.cheer': 'Cheer',
    'feed.booked': 'booked',
    'feed.checkin': 'checked in to',
    'feed.empty': 'No activity yet.',

    // badges
    'badges.title': 'Achievements',
    'badges.earned': 'Earned',
    'badges.locked': 'Locked',

    // referral
    'referral.title': 'Invite a friend',
    'referral.body': 'Train better together. Share your code — you both get a reward.',
    'referral.reward': '1 month free for every friend who joins',
    'referral.code': 'Your code',
    'referral.copy': 'Copy',
    'referral.copied': 'Copied!',
    'referral.share': 'Share',

    // home nudge / social proof
    'nudge.title': 'Your friends are training',
    'nudge.goingOne': 'is booked for',
    'nudge.goingMany': 'are booked for',
    'nudge.others': 'others',
    'nudge.join': 'Join them',
    'schedule.going': 'booked',
    'streak.week': 'week in a row',
    'sheet.friendGoing': 'friend booked',
    'sheet.friendsGoing': 'friends booked',

    // messaging
    'nav.messages': 'Messages',
    'messages.title': 'Messages',
    'messages.subtitle': 'Chat with your coaches',
    'messages.coaches': 'Coaches',
    'messages.empty': 'No messages yet. Say hi!',
    'messages.placeholder': 'Write a message …',
    'messages.send': 'Send',
    'messages.reply': 'Usually replies within an hour',

    // share
    'share.title': 'Share',
    'share.native': 'Share …',
    'share.copyLink': 'Copy link',
    'share.copied': 'Copied!',
    'share.igHint': 'Caption copied — paste it on Instagram',

    // profile additions
    'profile.share': 'Share your progress',
    'profile.changePhoto': 'Change photo',
    'trainer.message': 'Send message',

    // messaging — recipients / inbox
    'messages.new': 'New message',
    'messages.chooseRecipient': 'Who do you want to message?',
    'messages.general': 'Front desk',
    'messages.generalDesc': 'Goes to the gym — anyone on the team can reply',
    'messages.noneMember': 'No conversations yet. Start a new message!',
    'inbox.title': 'Inbox',
    'inbox.subtitle': 'Messages from members',
    'inbox.empty': 'No messages here.',
    'inbox.staff': 'You',
    'inbox.re': 'Re:',

    // admin — trainers
    'admin.nav.inbox': 'Inbox',
    'admin.nav.trainers': 'Trainers',
    'admin.tr.title': 'Trainers',
    'admin.tr.subtitle': 'Manage your team & instructors',
    'admin.tr.add': 'New trainer',
    'admin.tr.edit': 'Edit trainer',
    'admin.tr.new': 'New trainer',
    'admin.tr.delete': 'Delete trainer',
    'admin.tr.name': 'Name',
    'admin.tr.role': 'Role',
    'admin.tr.specialties': 'Specialties',
    'admin.tr.bio': 'About',
    'admin.tr.contactable': 'Members can message',
    'admin.tr.notContactable': 'Not contactable',
  },
} as const

export type TranslationKey = keyof (typeof translations)['no']
