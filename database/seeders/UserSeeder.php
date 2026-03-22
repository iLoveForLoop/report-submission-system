<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            ['05861','Lennoire','Lady Lennoire','Partosa','Abad','female','DILG - Alicia','LGOO VI','ellelee130613@gmail.com','M&M'],
            ['06793','Norman','Norman','Loquellano','Ali','male','DILG - Calape','LGOO VI','normansamsheikh@gmail.com',"D'ONE"],
            ['05871','Jennifer','Jennifer','Portrias','Amihan','female','DILG - Catigbian','LGOO VI','jjjamihan@gmail.com',"D'ONE"],
            ['COJ 0156','Lerave','Lerave','Oguis','Anoc','female','DILG Provincial Office','AA II','leraveanoc@gmail.com','focal'],
            ['COJ 0001','Nikko','Nikko Audrey','A','Aranas','male','DILG Provincial Office','JO','nkkdryaranas@gmail.com',null],
            ['COJ 0102','Mark','Eris Mark','Baguio','Aya-ay','male','DILG Provincial Office','Engineer II','aerismark@gmail.com','focal'],
            ['05821','Jocelyn','Jocelyn','Bautista','Bandala','female','DILG - Loboc','LGOO VI','joydear_31@yahoo.com','M&M'],
            ['05874','Wilfrans','Wilfrans','Telmo','Bangalao','female','DILG - Dagohoy','LGOO VI','bangalaowilfrans@yahoo.com','M&M'],
            ['05674','Regina','Regina Gina','Gatal','Bastes','female','DILG Provincial Office','LGOO VII','rggbastes22@gmail.com',null],
            ['05951','Karen','Karen Ann','Betonio','Beniga','female','DILG - Ubay','LGOO VI','karenbeniga23@gmail.com','M&M'],
            ['05912','Eunice','Eunice Anne','Caballo','Boniel','female','DILG - Guindulman','LGOO VI','eacaballo9392@gmail.com','M&M'],
            ['05802','Nicanor','Nicanor','Paredes','Bungabong','male','DILG - Bilar','LGOO VI','nicbungabong@gmail.com','M&M'],
            ['05853','Michael','Michael','Babor','Cabanag','male','DILG - Talibon','LGOO VI','mbcabanag@dilg.gov.ph',"D'ONE"],
            ['05877','Christine','Christine Rose','Fabio','Cagampang','female','DILG - Sevilla','LGOO VI','cfcagampang@dilg.gov.ph','M&M'],
            ['05786','Jeanette','Jeanette','Cacho','Camilotes','female','DILG Provincial Office','LGOO III','jeancam51896@gmail.com','focal'],
            ['COJ 0021','Glenda','Glenda','Barquilla','Campecino','female','DILG Provincial Office','ENGINEER II','glendzcamp@gmail.com','focal'],
            ['06055','Carlos','Carlos Falcon','Quinal','Celosia','male','DILG Provincial Office','LGOO II','falkens86@gmail.com','focal'],
            ['06049','Erika','Erika Nicole','Chiu','Corona','female','DILG Provincial Office','LGOO II','enicccorona.dilg7@gmail.com','focal'],
            ['COJ 0106','Geralyn','Geralyn Janette','Chiu','Corona','female','DILG Provincial Office','PEO II','geralynchiucorona@gmail.com',null],
            ['05856','Dyosa','Dyosa Marie','Poquita','Cosare','female','DILG - Sagbayan','LGOO VI','asoyd0805dilg@gmail.com',"D'ONE"],
            ['06045','Rosalinda','Rosalinda','Gingo','Dahunog','female','DILG Provincial Office','LGOO II','sallygingo.jeps@gmail.com','focal'],
            ['05857','Anthony','Anthony Dei','Villamor','Dalida','male','DILG - Jagna','LGOO VI','adalida.dilgbohol@gmail.com','M&M'],
            ['05828','Adonis','Adonis','Rafols','Damalerio','male','DILG - Antequera','LGOO VI','adonisdilg@gmail.com',"D'ONE"],
            ['JO2','Benigna','Benigna','Pernia','Damasin','female','DILG Provincial Office','JO','bedamdilg1983@gmail.com',null],
            ['05858','Judy','Judy Grace','Rulona','Dominguez','female','DILG - Candijay','LGOO VI','jgrdominguez78@gmail.com','M&M'],
            ['05876','Clyde','Clyde','Bongalos','Ebojo','male','DILG Provincial Office','LGOO VI','cbebojo@dilg.gov.ph','focal'],
            ['05888','Rhea','Rhea Joy','Orioque','Figueroa','female','DILG - Buenavista','LGOO VI','simple.philjoy1@gmail.com',"D'ONE"],
            ['05855','Mylove','Mylove','Cardinoza','Flood','female','DILG Provincial Office','LGOO VI','mcflood@dilg.gov.ph',null],
            ['05879','Hyacinth','Hyacinth','Pondoc','Garrote','female','DILG - Sierra Bullones','LGOO VI','hyacinthgarrote@yahoo.com','M&M'],
            ['06030','Meah','Meah Hecell','Nisnisan','Genovia','female','DILG Provincial Office','LGOO II','hecellmae@gmail.com','focal'],
            ['COJ 0019','Ruel','Ruel','Datahan','Go','male','DILG Provincial Office','ENGINEER III','maninz31@yahoo.com','focal'],
            ['05805','Florencio Jr.','Florencio Jr.','Virador','Halasan','male','DILG - Balilihan','LGOO VI','fvhalasan@dilg.gov.ph',"D'ONE"],
            ['05130','Ma. Sharon','Ma. Sharon','Marimon','Halasan','female','DILG - Dauis','LGOO VI','ladysshh@gmail.com',"D'ONE"],
            ['05863','Mona','Mona Lissa','Torralba','Hinog','female','DILG - Alburquerque','LGOO VI','mrsripe143@gmail.com',"D'ONE"],
            ['05783','Ismael','Ismael Vincent','Tibordo','Igcalinos','male','DILG - Garcia Hernandez','LGOO VI','vinceigcalinos79@gmail.com','M&M'],
            ['05993','Jed','Jed','Borella','Ighot','male','DILG Provincial Office','LGOO V','jbighot@dilg.gov.ph','M&M'],
            ['05881','Laurence','Drib Laurence','Bete','Ingles','male','DILG - Anda','LGOO VI','dribingles@gmail.com','M&M'],
            ['05968','Diolito','Diolito','Apao','Iyog','male','DILG - Pres. CPG','LGOO VI','daiyog@dilg.gov.ph','M&M'],
            ['05789','Maura','Maura','Monillas','Justol','female','DILG - Getafe','LGOO VI','maurajustol14344@gmail.com',"D'ONE"],
            ['05997','Lee','Lee Joshua','Ariata','Kaindoy','male','DILG - Tagbilaran City','ADA IV','kaindoyleejoshua@gmail.com',"D'ONE"],
            ['05691','Uldarick','Uldarick','Cagata','Ladores','male','DILG Provincial Office','ADA VI','uldarickladores@gmail.com',null],
            ['05840','Glenda','Glenda','Asoy','Laude','female','DILG - Loon','LGOO VI','galaude@dilg.gov.ph',"D'ONE"],
            ['05873','Maria','Maria Luz','Estoque','Lintua','female','DILG - Valencia','LGOO VI','marialuzlintua@gmail.com','focal'],
            ['05781','Angelo','Angelo','Sepalon','Mahinay','male','DILG - Tubigon','LGOO VI','angelo.dilg2002@gmail.com',"D'ONE"],
            ['05836','Elvira','Elvira','Bastes','Mandin','female','DILG - Dimiao','LGOO VI','elvirabmandin@gmail.com','M&M'],
            ['05972','Ruben','Ruben','Manongas','Manlangit','male','DILG Provincial Office','ADA IV','asitaulava27@gmail.com',null],
            ['05731','Ted','Ted','Nalam','Mascarinas','male','DILG - Sikatuna','LGOO VI','tnmascarinas46@gmail.com',"D'ONE"],
            ['06066','Khanda','Khanda','Garrote','Medequiso','female','DILG Provincial Office','LGOO II','medequisokhanda@gmail.com','focal'],
            ['COJ 0116','Ricardo Jr.','Ricardo Jr.','Ompad','Montanez','male','DILG Provincial Office','ENGINEER II','rickymonz37@gmail.com','focal'],
            ['05882','Nina','Nina Christine','Penales','Montejo','female','DILG - Carmen','LGOO VI','christinenina17@gmail.com','M&M'],
            ['05774','Josie','Josie','Marfe','Montes','female','DILG - Corella','LGOO VI','eisoj79@yahoo.com',"D'ONE"],
            ['05792','Fidel','Fidel','Maragañas','Narisma','male','DILG - Baclayon','LGOO VI','fidelnarisma@gmail.com',"D'ONE"],
            ['05804','Cecilio','Cecilio','Sumaoy','Nisnisan','male','DILG - Panglao','LGOO VI','nisnisancecilio@gmail.com',"D'ONE"],
            ['05936','Julie','Julie Mae','Paredes','Nombre','female','DILG - Duero','LGOO V','paredesjuliemae89@gmail.com','M&M'],
            ['05699','Juliet','Juliet','Caduyac','Olalo','female','DILG - Tagbilaran City','LGOO VI','jcolalo@dilg.gov.ph',"D'ONE"],
            ['06050','Faye','Faye Arielle','Adanza','Oliquino','female','DILG Provincial Office','LGOO II','faoliquino@dilg.gov.ph','focal'],
            ['05995','Jun','Jun Arcy','Olaer','Pacleb','male','DILG- Bohol Provincial Office','LGOO V','jopacleb@dilg.gov.ph','focal'],
            ['05697','Ma. Reina','Ma. Reina','Abellana','Quilas','female','DILG Provincial Office','LGOO VII','ate_ye@yahoo.com','focal'],
            ['05847','Jose','Jose Ruben','Himalaloan','Racho','male','DILG - Maribojoc','LGOO VI','rubentrina2004@gmail.com',"D'ONE"],
            ['05878','Emmylou','Emmylou','Fuertes','Rama','female','DILG - Danao','LGOO VI','emzkieruns@gmail.com',"D'ONE"],
            ['05880','Ana','Ana Theresa','Gotardo','Rasonabe','female','DILG - Mabini','LGOO VI','anatheresagotardo@gmail.com','M&M'],
            ['05793','Ma. Leizl','Ma. Leizl','Caseñas','Redita','female','DILG Provincial Office','AAS II','leizl1013@yahoo.com',null],
            ['05957','Sarah','Sarah Kristina','Garrote','Romanillos','female','DILG - Inabanga','LGOO VI','skromanillos@gmail.com',"D'ONE"],
            ['05803','Jogepons','Jogepons','Abarquez','Ruloma','male','DILG - Clarin','LGOO VI','snopegoj.jar@gmail.com',"D'ONE"],
            ['05862','Ian','Jun Ian','Autentico','Suric','male','DILG - Bien Unido','LGOO VI','dilgians@gmail.com','M&M'],
            ['05713','Jekeri','Jose Jekeri','Piquero','Taningco','male','DILG - San Isidro','LGOO VI','jptaningco@dilg.gov.ph',"D'ONE"],
            ['05994','Joycelou','Joycelou','Rios','Telmo','female','DILG-Cortes','LGOO V','jrtelmo@dilg.gov.ph',"D'ONE"],
            ['06046','Lorenzo','Lorenzo','Caduyac','Torero','male','DILG Provincial Office','LGOO II','oznertorero@gmail.com','focal'],
            ['05899','Rachel','Rachel','Salomon','Torremocha','female','DILG - Lila','LGOO VI','srchel17@gmail.com','M&M'],
            ['06047','Jessa','Jessa Jan','Abing','Trazo','female','DILG Provincial Office','LGOO II','jessajan22@gmail.com','focal'],
            ['05869','Jayson','Jayson','Barajan','Tumale','male','DILG - Batuan','LGOO VI','jbtumale@dilg.gov.ph','M&M'],
            ['05706','Rhoel','Rhoel','Andoy','Tumarao','male','DILG - Trinidad','LGOO VI','bairoelbai@gmail.com',"D'ONE"],
            ['No Code','Bruce','Bruce','Roa','Unabia','male','DILG Provincial Office','ISA I','bruceunabia2000@gmail.com','focal'],
            ['05839','Nilda','Nilda','Painagan','Unajan','female','DILG - Pilar','LGOO VI','npunajan@dilg.gov.ph','M&M'],
            ['05819','Mary','Mary Ann','Aparece','Verga','female','DILG - Loay','LGOO VI','ashiira_dilg@yahoo.com','M&M'],
            ['05941','Lindsey','Lindsey Marie','Arcilla','Vismanos','female','DILG - San Miguel','LGOO VI','lavismanos@dilg.gov.ph','M&M'],
            ['05732','Johnjoan','Johnjoan','Aya-ay','Mende','male','DILG Provincial Office','LGOO VIII','manongpawikan@gmail.com',null],
            ['06018','Ronnel','Ronnel','Matin-ao','Atuel','male','DILG - Tagbilaran City','LGOO II','ronnel.m.atuel@gmail.com',"D'ONE"],
            ['000','ZieraParedes','Ziera May','Azures','Paredes','female','DILG Provincial Office','AA II','zieraparedes@gmail.com','focal'],
        ];

        foreach ($users as $u) {

            $cluster = $u[9] ?? null;

            $user = User::create([
                'employee_code' => $u[0],
                'name' => $u[1],
                'first_name' => $u[2],
                'middle_name' => $u[3],
                'last_name' => $u[4],
                'gender' => $u[5],
                'department' => $u[6],
                'position' => $u[7],
                'email' => $u[8],
                'cluster' => in_array($cluster, ['M&M', "D'ONE"]) ? $cluster : null,
                'password' => Hash::make('password'),
            ]);

            switch ($u[9]) {
                case 'M&M':
                case "D'ONE":
                    $user->assignRole('field_officer');
                    break;
                case 'focal':
                    $user->assignRole('focal_person');
                    break;
                case 'PROGRAM HEAD':
                    $user->assignRole('program_head');
                    break;
                case 'PROVINCIAL DIRECTOR':
                    $user->assignRole('provincial_director');
                    break;
            }

            $user->save();
        }
    }
}