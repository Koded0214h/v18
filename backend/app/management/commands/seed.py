"""
Seed command — run once to populate the database with initial content.
Usage: python manage.py seed
       python manage.py seed --flush   # clears existing data first
"""
from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import date, timedelta
import random

from app.models import Memory, Commit, Message, JournalEntry, RoadmapItem, MapPin


MEMORIES = [
    # Growth / Achievement
    dict(title="Started 100-level at university", date=date(2025, 9, 10), category="growth",
         description="First day as a 100-level CS student. Walked into the department like I owned it — imposter syndrome fully present, but I didn't let it show.", quote="Level up or stay stuck."),
    dict(title="Won the campus hackathon", date=date(2025, 10, 5), category="growth",
         description="48 hours of pure focus. We built a supply chain dApp on Solana and took first place. Didn't sleep. Didn't care.", song="Burna Boy — Last Last"),
    dict(title="Founded Teenovatex Labs", date=date(2025, 11, 20), category="growth",
         description="Officially registered the org with Shaz and Anas. We want to build something real for African student builders.", quote="If not us, who?"),
    dict(title="CGPA hit 4.59", date=date(2025, 12, 15), category="growth",
         description="Results dropped. My CGPA climbed to 4.59. Proof that discipline compounds.", song="Drake — Started From the Bottom"),
    dict(title="First freelance client paid", date=date(2026, 1, 8), category="growth",
         description="₦180k for a full-stack dashboard. First real money from code. Felt surreal staring at that notification."),
    dict(title="Shipped v1 of Stackd with Koded", date=date(2026, 2, 14), category="growth",
         description="The learning platform is live. 20 students enrolled in the first week. Building is different when people actually show up.", quote="Ship. Iterate. Ship again."),
    dict(title="First open-source PR merged", date=date(2026, 3, 3), category="growth",
         description="Contributed to a real project people use. Maintainer merged it without a single change request. Small thing, but it meant a lot."),
    dict(title="Cold-emailed a founder, got a reply", date=date(2026, 4, 22), category="growth",
         description="Spent 2 hours on one email. Sent it at midnight. Woke up to a reply. Doors open to people who knock correctly."),

    # Productive / Consistent
    dict(title="30-day DSA streak", date=date(2025, 9, 30), category="productive",
         description="Solved a LeetCode problem every single day for 30 days. Most days I hated it. That's how I knew it was working."),
    dict(title="Sleep consistency — 3 weeks straight", date=date(2026, 1, 25), category="productive",
         description="In bed by midnight, up by 6. Three weeks. No all-nighters. My brain rewired."),
    dict(title="Daily prayer streak — Ramadan complete", date=date(2026, 3, 31), category="productive",
         description="All 30 days of Ramadan — fajr to isha, every prayer on time. The discipline of this month bleeds into everything else."),

    # Emotional / Relational
    dict(title="Conversation with Dad at 1am", date=date(2025, 8, 15), category="emotional",
         description="He told me he was proud. Just like that, no build-up. I didn't know what to do with it so I just said thank you and we sat in silence. It was enough.", quote="Some moments don't need words."),
    dict(title="Lost a close friend", date=date(2025, 10, 18), category="emotional",
         description="Not to death — to distance. We were building the same dream and then one day we weren't. Grief for living people is quieter and longer."),
    dict(title="The team dinner after the win", date=date(2025, 10, 6), category="emotional",
         description="The four of us at a suya spot at midnight, exhausted, laughing about everything that almost went wrong. These are the moments I build for.", song="Tems — Free Mind"),
    dict(title="Mum's smile when I showed her the dashboard", date=date(2026, 1, 9), category="emotional",
         description="She scrolled through the whole thing twice. Then she called my aunt to brag. That's the review that counts."),

    # Faith
    dict(title="Ramadan 2026 begins", date=date(2026, 3, 1), category="faith",
         description="Woke up for suhoor on the first day. In the quiet of that hour — no phone, no Twitter, no build — I remembered why I do any of this.", quote="Indeed, with hardship comes ease."),
    dict(title="Prayed Fajr on a rooftop in Lagos", date=date(2026, 4, 5), category="faith",
         description="4:58am, the city still dark. Made sujood and felt the ground beneath me. These are the moments that recalibrate everything.", song="Maher Zain — Number One For Me"),
    dict(title="Istikhara before a big career decision", date=date(2026, 2, 28), category="faith",
         description="Before I submitted, I made istighfar and prayed istikhara. Whatever comes, I asked Allah first. That's the only way I know how to move."),

    # Difficult / Failure
    dict(title="Shipped broken code to prod", date=date(2025, 9, 22), category="difficult",
         description="Forgot to test an edge case. The client's dashboard broke during a demo. I fixed it in 20 minutes but those 20 minutes felt like a year."),
    dict(title="The project that never launched", date=date(2025, 11, 5), category="difficult",
         description="Three months of work. We killed it two weeks before launch because the market shifted. I'm still not fully over it."),
    dict(title="The burnout dip — November", date=date(2025, 11, 30), category="difficult",
         description="Two weeks where I couldn't write a single line of code. Opened VS Code, stared at it, closed it. I thought something was wrong with me.", quote="Rest is not quitting."),
    dict(title="Failed the first DSA mock interview", date=date(2025, 10, 28), category="difficult",
         description="Blanked on a problem I'd solved before. Anxiety turned my brain off. Failed. Called Shaz. He said: 'Fail fast, adjust faster.' I went back to basics."),

    # Experimentation / Ideation
    dict(title="Built a Solana smart contract in Rust", date=date(2025, 10, 2), category="experiment",
         description="Never written Rust before. Spent a whole day fighting the borrow checker. By midnight I had a working escrow program. Rust is beautiful and brutal.", code_snippet="pub fn process_instruction(\n    program_id: &Pubkey,\n    accounts: &[AccountInfo],\n    instruction_data: &[u8],\n) -> ProgramResult {"),
    dict(title="Tried ML for the first time", date=date(2026, 1, 15), category="experiment",
         description="Built a basic image classifier with PyTorch. Terrible accuracy. But I understood what a tensor was for the first time. The path to AI/ML starts somewhere.", song="J. Cole — Let Nas Down"),
    dict(title="Designed Koded OS v18 concept", date=date(2026, 5, 1), category="experiment",
         description="Three pages of notes. Figma mockups. The vision for this site — an OS, not a website. Sometimes ideas feel like discoveries, not inventions.", quote="This is the current state of Abdulrahman."),

    # Basketball / Physical
    dict(title="First dunk attempt", date=date(2025, 8, 20), category="basketball",
         description="6 months of vert training. I finally got fingertips on the rim. Came down hard on my ankle. Worth it."),
    dict(title="3-on-3 win at the outdoor court", date=date(2025, 12, 28), category="basketball",
         description="My crew vs the guys who play every day. We were down 8-3. Came back to win 11-9. I hit the last bucket. Streets remember.", song="NBA YoungBoy — Make No Sense"),
    dict(title="40-day workout streak", date=date(2026, 2, 5), category="basketball",
         description="Morning workouts for 40 straight days. Discipline in the gym is discipline everywhere."),
]


COMMITS = [
    dict(type="feat", scope="life", message="entered university as a 100-level CS student",
         timestamp=timezone.make_aware(timezone.datetime(2025, 9, 10, 8, 0)),
         branch="life/main", tag="v17.4", reflection="The real work begins now."),
    dict(type="fix", scope="mindset", message="stopped chasing external validation",
         timestamp=timezone.make_aware(timezone.datetime(2025, 9, 20, 23, 12)),
         reflection="Ran a full audit on what I was building for. Removed the approval-seeking loop. Replaced with: build because it matters."),
    dict(type="hotfix", scope="hackathon", message="debugged Anchor contract at 2am, shipped at 4am",
         timestamp=timezone.make_aware(timezone.datetime(2025, 10, 5, 4, 0)),
         tag="v17.5", reflection="Two hours before judging. Zero sleep. Found the issue: off-by-one in the escrow logic. Fixed, tested, submitted."),
    dict(type="feat", scope="team", message="founded Teenovatex Labs with Shaz and Anas",
         timestamp=timezone.make_aware(timezone.datetime(2025, 11, 20, 15, 30)),
         branch="life/main", reflection="We wrote the mission on a napkin. Corny but true."),
    dict(type="refactor", scope="identity", message="learning who I am outside the code",
         timestamp=timezone.make_aware(timezone.datetime(2025, 11, 28, 21, 0)),
         reflection="I realized I'd been defining myself entirely by output. Started reading more. Journaling. Praying more intentionally."),
    dict(type="chore", scope="grind", message="day 47 of DSA prep. still going.",
         timestamp=timezone.make_aware(timezone.datetime(2025, 11, 16, 7, 30))),
    dict(type="perf", scope="discipline", message="improved sleep consistency — 3 weeks straight",
         timestamp=timezone.make_aware(timezone.datetime(2026, 1, 25, 6, 0)),
         reflection="Turns out my 'energy problem' was just a 'sleep problem' in disguise."),
    dict(type="feat", scope="product", message="launched Stackd with Koded — 20 students week one",
         timestamp=timezone.make_aware(timezone.datetime(2026, 2, 14, 12, 0)),
         tag="v17.8", reflection="Seeing people learn from something I built. Different kind of dopamine."),
    dict(type="feat", scope="career", message="sent first cold email to a founder — got a reply",
         timestamp=timezone.make_aware(timezone.datetime(2026, 2, 28, 23, 59)),
         branch="life/career", reflection="Spent 2 hours on that email. Replied in under 24 hours. Tawakkul done."),
    dict(type="fix", scope="product", message="hotfix prod dashboard after broken deploy",
         timestamp=timezone.make_aware(timezone.datetime(2025, 9, 22, 14, 5)),
         reflection="Lesson: always test edge cases before client demos. Always."),
    dict(type="revert", scope="project", message="cancelled project X — 3 months, never launched",
         timestamp=timezone.make_aware(timezone.datetime(2025, 11, 5, 20, 0)),
         reflection="Killed my own project two weeks before launch. Market changed. Still haunts me a little. That's how you learn to validate faster."),
    dict(type="merge", scope="life", message="merged Ramadan discipline into permanent habits",
         timestamp=timezone.make_aware(timezone.datetime(2026, 3, 31, 18, 0)),
         reflection="30 days of structure. Decided to keep the good parts."),
    dict(type="feat", scope="career", message="first open-source contribution merged to production",
         timestamp=timezone.make_aware(timezone.datetime(2026, 4, 22, 17, 0)),
         tag="v18.0-rc1", branch="life/career", reflection="Real code, real users, real impact. Alhamdulillah."),
    dict(type="perf", scope="fitness", message="40-day morning workout streak — no days off",
         timestamp=timezone.make_aware(timezone.datetime(2026, 2, 5, 6, 30))),
    dict(type="feat", scope="systems", message="built first Solana smart contract in Rust",
         timestamp=timezone.make_aware(timezone.datetime(2025, 10, 2, 23, 45)),
         reflection="Borrow checker nearly broke me. Then it clicked. Rust respects you only after it humbles you."),
    dict(type="chore", scope="faith", message="completed Ramadan — all 30 fasts kept",
         timestamp=timezone.make_aware(timezone.datetime(2026, 3, 30, 7, 0)),
         branch="life/deen"),
    dict(type="refactor", scope="burnout", message="rest protocol engaged — two weeks off",
         timestamp=timezone.make_aware(timezone.datetime(2025, 11, 30, 10, 0)),
         reflection="Couldn't code. Didn't force it. Walked. Read. Played basketball. Came back sharper."),
    dict(type="feat", scope="build", message="started Koded OS v18 — the living archive",
         timestamp=timezone.make_aware(timezone.datetime(2026, 5, 1, 0, 1)),
         tag="v18.0-init", branch="life/main", reflection="This is the current state of Abdulrahman."),
    dict(type="fix", scope="relationships", message="repaired friendship after long silence",
         timestamp=timezone.make_aware(timezone.datetime(2026, 1, 20, 19, 0)),
         reflection="Sent the message I'd been drafting in my head for weeks. He replied immediately. Pride is expensive."),
    dict(type="perf", scope="learning", message="completed first ML model — PyTorch classifier",
         timestamp=timezone.make_aware(timezone.datetime(2026, 1, 15, 22, 0)),
         reflection="Terrible accuracy. Perfect foundation."),
]


JOURNAL_ENTRIES = [
    dict(
        title="Things I learned at 17",
        excerpt="A year distilled into the lessons I'd tell my past self, if he'd listen.",
        content="""## Things I Learned at 17

Not all of these came easy. Most came from getting it wrong first.

### 1. Output is not identity.
I spent most of 17 believing that what I built *was* who I was. If the product failed, I failed. If the code broke, I broke. That's a dangerous equation. You are not your commits.

### 2. Rest is not quitting.
November broke me. Two weeks where I couldn't write a line. I thought something was wrong with me. Turns out I'd been running on debt for months and the bill arrived. Rest isn't weakness — it's maintenance.

### 3. The best ideas come in conversation, not isolation.
I built the best version of Teenovatex Labs in a 2am conversation with Shaz. Not in my room alone. Collaboration doesn't dilute vision — it sharpens it.

### 4. Validation-seeking is a slow poison.
I was building for the reactions. The retweets. The "bro that's cold." When I finally stopped caring, the work got better. Weird how that works.

### 5. Your deen is infrastructure, not decoration.
Faith isn't the thing I reach for when everything else fails. It's the load-bearing wall. When I got that right — when prayer became discipline, not habit — everything else got clearer.

### 6. Failing fast is a superpower.
I killed a 3-month project two weeks before launch. It hurt. But I learned in 3 months what most people spend a year figuring out. The scar is worth the lesson.

### 7. The people who show up at midnight matter.
Not the ones who congratulate you on LinkedIn. The ones who answer when you call at 2am because the deployment broke. Hold those people close.
""",
    ),
    dict(
        title="Why I build",
        excerpt="It's not about the code. It's about what the code can change.",
        content="""## Why I Build

People ask me when I started coding. The honest answer is: I don't know. It happened the way sleep happens — gradually, then all at once.

But the more interesting question is *why* I keep building.

It's not the money, though money matters. It's not the status, though I'd be lying if I said the recognition doesn't feel good sometimes.

It's this: I believe software is one of the few things a kid in Lagos can build and have it reach London, New York, Tokyo — without a visa, without a middleman, without permission.

That's not a small thing.

I grew up watching people with massive ideas get stopped by infrastructure. Bad roads. Broken systems. No capital. The idea survives but the execution dies.

Code changes that equation.

When I write software, I'm not just solving a problem. I'm building a door where there used to be a wall. Maybe that sounds dramatic. Maybe it is. But that's what keeps me at the keyboard at 3am.

Africa has enough smart people. We just need more builders.

I want to be one of them.
""",
    ),
    dict(
        title="On faith and ambition",
        excerpt="How do you hold both? I'm still figuring it out.",
        content="""## On Faith and Ambition

There's a tension I live with.

I want to build things that matter. I want to be known for them. I want financial freedom and global impact and a name that means something in African tech. I want the internship. I want the startup. I want the rooms I'm not in yet.

And then I read: *"And what is the life of this world except the enjoyment of delusion."* (3:185)

So how do you hold both?

I've been sitting with this for a long time. Here's where I've landed — provisionally, imperfectly:

Ambition isn't the problem. *Attachment* is the problem.

I can want the opportunity and work hard for it and feel the disappointment if it doesn't come — but I can't let the outcome define my worth. That's not Islamic resignation. That's mature engineering. You give the process everything and you detach from the result.

Tawakkul isn't passive. It's the thing you do *after* you've done the work.

The Prophet (ﷺ) said: "Tie your camel, then put your trust in Allah."

So I tie the camel. I study the DSA. I write the cover letter. I push the code. I do everything within my capacity.

And then I let go.

Faith and ambition aren't opposites. They're partners — if you understand what each one is actually asking of you.

I'm still learning. But that's where I am.
""",
    ),
    dict(
        title="What burnout felt like",
        excerpt="Two weeks where the thing I love felt like nothing.",
        content="""## What Burnout Felt Like

November 2025. I opened VS Code, stared at the blinking cursor for twenty minutes, and closed my laptop.

That happened every day for two weeks.

I'd been running at 100% since September — university, freelancing, Teenovatex, DSA prep, side projects, all of it stacked. I thought I was being disciplined. I was being reckless.

The weird thing about burnout is it doesn't feel like tired. Tired has a solution (sleep). Burnout feels like the thing you love has been replaced by a grey identical version of itself. You look at a problem you'd normally find exciting and feel... nothing.

I didn't tell anyone at first. I kept posting like everything was fine. I kept opening Notion and writing fake plans. I was performing productivity for an audience of one.

What broke the loop: Shaz called, out of nowhere, and said "you sound dead, bro." He didn't mean it as a diagnosis but it was one.

I told him everything. He didn't give me a productivity hack. He just said: "Rest. The code will still be here."

So I rested.

I played basketball. I re-read parts of the Quran I hadn't visited in months. I watched three seasons of a show I had no reason to feel guilty about watching. I slept before midnight.

Two weeks later, I opened VS Code. The cursor was blinking. I wrote 300 lines in an hour.

The lesson isn't "hustle smarter." The lesson is: you are not a machine and pretending otherwise is a bug, not a feature.
""",
    ),
    dict(
        title="My Last Few Months",
        excerpt="Not the highlight reel. The whole thing.",
        content="""## My Last Few Months

Nobody told me that doing everything at once was going to feel like this.

Exams last month. A hackathon deadline this week. A full technical lead role at Teenovatex. A bootcamp I launched from scratch. And somewhere in between all of that, I wrote a book.

This is what the last few months have actually looked like for me. Not the highlight reel. The whole thing.

I am Koded. I build things. Sometimes too many things at the same time. And somewhere in the chaos of this season I stumbled into the most practical education of my life — one that no classroom, no book, and no two hour YouTube video could have given me.

It started with a realization that hit me harder than I expected. I had been running on what I now call the bare minimum limiter. A quiet mental filter that killed high-effort ideas before they ever had a chance to breathe. Anything that felt like too much got scaled down automatically. I didn't even notice I was doing it.

When I finally saw it clearly I made a decision. April would be different. No limiter. Full throttle.

So here is what the last few months actually looked like.

## I built Janus.

Janus is an AI-native execution framework I built for the Ranger Hackathon on Solana. The idea was simple but the execution was anything but — an autonomous trading bot that manages Delta-Neutral strategies on Drift Protocol while enforcing on-chain compliance through a smart contract policy engine and MPC sharded key security via the Ika Network.

What that means in plain English — most AI trading bots require full private key access, which is terrifying from a security standpoint. Janus splits the key, enforces spend limits and protocol rules on-chain, and requires an atomic compliance check before any trade executes. The AI is an operator, not an owner. It literally cannot move funds without permission from the on-chain judge.

Four layers. Python and Gemini for strategy. Drift V2 and Jupiter for trading. Solana and Anchor for enforcement. Ika Network for security. Built while I had exams. Built while I was launching a bootcamp. Built because removing the limiter meant I stopped asking myself if now was a good time.

## I led at Teenovatex.

As Technical Lead I have been making architecture decisions, running developer sessions, and making sure we are building things that actually matter. The role has taught me something I didn't expect — leadership is less about knowing the most and more about creating the conditions for other people to do their best work. That lesson has shown up everywhere else in my life since.

## I launched Stackd with Koded.

Four days. That is how long it took to go from idea to paying students. Flier, pricing, copy, registration flow, WhatsApp community, built in a weekend. Then we hosted a free live session at Teenovatex. Thirty plus people showed up. We had a hostess, a TX rep, structured slides, a full script, interactive polls, real conversations. We broke down every major tech track in plain English and let people ask anything.

The response was something I didn't fully anticipate. People didn't just find it useful. They felt seen by it. Because we talked about the real stuff — tutorial hell, not knowing where to start, being scared that tech is too hard, watching everyone else figure it out while you're still standing still.

We now have paying students across all six tracks. More coming.

## I wrote a book.

After the session I sat down and wrote The Cracked Dev Playbook. Thirteen chapters. The entire framework we taught in the session — which track is right for you, what your first thirty days look like, how to build a resume that actually gets interviews, why YouTube tutorials are failing you, and what Stackd is here to do about all of it.

It got over 100 reads in the first few hours. From a book I wrote in one sitting. After a hackathon build. After a live session. After exams.

---

## Key Lessons Learned

Warm leads go cold in five minutes. The moment someone says they're interested is the moment to act. Waiting even an hour changes the energy completely.

Free value converts better than everything else. The free session brought in more students than every paid post combined. Give something real first. Trust does the selling for you.

People buy from people. Every conversion happened in a direct conversation. Not from a caption. Not from a flier. From me talking to a person like a human being.

Structure beats hustle. A clear offer, a clear price, and a frictionless way to register matters more than how loud you shout or how hard you grind.

Your network is infrastructure. The senior developers in my circle are now tutoring on the platform. The resources around you are almost always being underused.

And the biggest lesson of all — the bare minimum is a personality, not a strategy. Once it becomes your default you stop seeing the ceiling because you've convinced yourself the floor is enough.

I am a few months into the most real education of my life. No campus. No lecturer. No exam — well, except the actual exams I was also sitting. Just real decisions with real consequences and lessons that stick because they cost something.

I don't know exactly where this goes. But I know I'm not doing the bare minimum anymore.

And that changes everything.
""",
    ),
    dict(
        title="Removing the Bare Minimum Limiter — Part 2",
        excerpt="Week of chaos, exams, a hackathon I almost didn't attend, and somehow, a W.",
        content="""## Removing the Bare Minimum Limiter — Part 2

There's this thing that happens to me at hackathons.

I show up, I build, we lose. Or I don't show up, and somehow, we win. It's happened enough times that it stopped being a coincidence and started feeling like a curse. Like my physical presence was the variable that broke everything.

So when the Harvard Health Hackathon landed on the same week as my university exams — same area, same Lagos heat — I made peace with not going. I told my team I'd be around if they needed me. I wasn't planning to walk through those doors.

Then I walked through those doors.

---

## The Last One In

I was the last participant to arrive.

My team had been there for a while. The energy was already off — deployment issues, things not connecting, the usual chaos that shows up right before a deadline. I dropped my bag and started asking questions.

The main problem: we couldn't deploy the blockchain anywhere. Our backend needed to ping it, and a free Render server couldn't handle it. We were tight on time, no budget for a quick VPS, no clean solution in sight.

I sat with it for a minute.

Then: run everything on my laptop. Backend. Blockchain. Frontend. All of it local, on my machine, turned into a server. Tunnel only the frontend through ngrok. Print the prototype. Walk into the pitch room.

It worked.

---

## PharmChain

The product was PharmChain: a blockchain-based pharmaceutical supply chain tracker built for the Nigerian healthcare system. Counterfeit drugs are a real, deadly problem here. PharmChain puts every drug on-chain, traceable from manufacturer to patient, unforgeable.

It was the kind of idea that makes judges lean forward.

And when my teammate stood up to pitch — he was professional. Clean slides, confident delivery, answered every question. The judges didn't just clap. They offered to put in a good word with the managing directors of companies in the space.

I was sitting in the back trying not to manifest a loss.

---

## The Announcement

You know that specific kind of fear — where you want something badly enough that your body starts preparing for disappointment before the results are even out?

That was me. Sitting there. Running the mental math on every hackathon I'd physically attended.

They called our name.

I broke the loop.

---

## Everything Else That Happened This Week

Because apparently one thing isn't enough:

**Exams.** Multiple. Same week. Still standing.

**Leetcode Blind 75.** I'm at 40/75 in 13 days. Doing at least 2 problems daily — mastering patterns, not just solving, understanding why the solution works. In my free time I'm watching coding interview breakdowns on YouTube and running mock interviews.

**Fog of War.** This started as a hackathon submission. I was literally one minute late to submit. But I'm still building it. Full sprite system, better controls, tighter game mechanics. This isn't a hackathon project anymore. This is a game I'm building until it's actually peak.

**Stackd with Koded.** Week 2 with the first paying cohort. People are showing up. That means something.

**5 rejection letters.** They came in a batch one morning. Bending Spoons, Twilio, Remote, a couple others. It stings, I won't pretend it doesn't. But I applied, I got feedback, I improved the resume, I kept moving. That's the only response that makes sense.

**VC conversations from the hackathon.** The judges' interest in PharmChain opened doors I didn't expect. More on this as it develops.

---

## The Pattern

I used to think my presence at hackathons was the problem. Ten-plus events of building and losing while sitting right there — it messes with your head.

But I think the real variable was never me being there or not. It was whether I showed up ready. Whether I had something to give when things broke.

This week, things broke. I fixed them. We won.

That's the limiter coming off — not confidence, not motivation. Just doing the work until you're the person the team calls when it matters.

---

More next week. Stay Cracked.
""",
    ),
]


ROADMAP_ITEMS = [
    # v18
    dict(version="v18", text="Build meaningful products people use", is_done=False, order=1),
    dict(version="v18", text="Land a global tech opportunity", is_done=False, order=2),
    dict(version="v18", text="Deepen AI/ML systems knowledge", is_done=False, order=3),
    dict(version="v18", text="Become stronger mentally and physically", is_done=False, order=4),
    dict(version="v18", text="Grow Stackd with Koded to 20+ active students", is_done=True, order=5),
    dict(version="v18", text="Ship Koded OS v18 on birthday", is_done=False, order=6),
    # v19
    dict(version="v19", text="Launch first real startup", is_done=False, order=1),
    dict(version="v19", text="Robotics projects ship", is_done=False, order=2),
    dict(version="v19", text="$10M MRR", is_done=False, order=3),
    dict(version="v19", text="Move closer to global opportunities", is_done=False, order=4),
    dict(version="v19", text="Mentor 3 younger builders", is_done=False, order=5),
    # v20
    dict(version="v20", text="Financial freedom milestone", is_done=False, order=1),
    dict(version="v20", text="Global impact through products", is_done=False, order=2),
    dict(version="v20", text="Recognised name in African tech", is_done=False, order=3),
    dict(version="v20", text="(redacted — too ambitious to publish yet)", is_done=False, order=4),
]


SEED_MESSAGES = [
    dict(name="Shaz", message="commit a3f8d12: bro you actually built the thing. proud of you fr.", type="commit", location="Lagos, Nigeria"),
    dict(name="Anonymous", message="PR #18 approved: merge request — from everyone who's been watching. we see you.", type="pr", location=""),
    dict(name="Anas", message="[INFO] 2026-05-31T00:00:01: System online. v18 detected. Alhamdulillah.", type="log", location="Abuja, Nigeria"),
]

HOME_PIN = dict(name="@koded — home base", location="Lagos, Nigeria", latitude=6.5244, longitude=3.3792)

MAP_PINS = [
    # Africa
    dict(name="Shaz",          location="Abuja, Nigeria",            latitude=9.0579,   longitude=7.4951),
    dict(name="Anonymous",     location="Accra, Ghana",              latitude=5.6037,   longitude=-0.1870),
    dict(name="Temi",          location="Port Harcourt, Nigeria",    latitude=4.8156,   longitude=7.0498),
    dict(name="Anonymous",     location="Nairobi, Kenya",            latitude=-1.2921,  longitude=36.8219),
    dict(name="Zara",          location="Cairo, Egypt",              latitude=30.0444,  longitude=31.2357),
    dict(name="Anonymous",     location="Johannesburg, South Africa",latitude=-26.2041, longitude=28.0473),
    dict(name="Anonymous",     location="Cape Town, South Africa",   latitude=-33.9249, longitude=18.4241),
    dict(name="David",         location="Kampala, Uganda",           latitude=0.3476,   longitude=32.5825),
    dict(name="Anonymous",     location="Kigali, Rwanda",            latitude=-1.9441,  longitude=30.0619),
    dict(name="Chisom",        location="Enugu, Nigeria",            latitude=6.4584,   longitude=7.5464),
    dict(name="Anonymous",     location="Dar es Salaam, Tanzania",   latitude=-6.7924,  longitude=39.2083),
    dict(name="Anonymous",     location="Douala, Cameroon",          latitude=4.0511,   longitude=9.7679),
    dict(name="Kwame",         location="Kumasi, Ghana",             latitude=6.6885,   longitude=-1.6244),
    # Europe
    dict(name="Anonymous",     location="London, UK",                latitude=51.5074,  longitude=-0.1278),
    dict(name="Anonymous",     location="Paris, France",             latitude=48.8566,  longitude=2.3522),
    dict(name="Anonymous",     location="Berlin, Germany",           latitude=52.5200,  longitude=13.4050),
    dict(name="Mia",           location="Amsterdam, Netherlands",    latitude=52.3676,  longitude=4.9041),
    dict(name="Anonymous",     location="Stockholm, Sweden",         latitude=59.3293,  longitude=18.0686),
    dict(name="Anonymous",     location="Madrid, Spain",             latitude=40.4168,  longitude=-3.7038),
    dict(name="Anonymous",     location="Warsaw, Poland",            latitude=52.2297,  longitude=21.0122),
    dict(name="Anonymous",     location="Kyiv, Ukraine",             latitude=50.4501,  longitude=30.5234),
    dict(name="Anonymous",     location="Lisbon, Portugal",          latitude=38.7223,  longitude=-9.1393),
    dict(name="Amara",         location="Milan, Italy",              latitude=45.4642,  longitude=9.1900),
    # North America
    dict(name="Anonymous",     location="New York, USA",             latitude=40.7128,  longitude=-74.0060),
    dict(name="Anonymous",     location="San Francisco, USA",        latitude=37.7749,  longitude=-122.4194),
    dict(name="Anonymous",     location="Toronto, Canada",           latitude=43.6532,  longitude=-79.3832),
    dict(name="Jay",           location="Atlanta, USA",              latitude=33.7490,  longitude=-84.3880),
    dict(name="Anonymous",     location="Chicago, USA",              latitude=41.8781,  longitude=-87.6298),
    dict(name="Anonymous",     location="Los Angeles, USA",          latitude=34.0522,  longitude=-118.2437),
    dict(name="Anonymous",     location="Austin, USA",               latitude=30.2672,  longitude=-97.7431),
    dict(name="Anonymous",     location="Montreal, Canada",          latitude=45.5017,  longitude=-73.5673),
    dict(name="Anonymous",     location="Mexico City, Mexico",       latitude=19.4326,  longitude=-99.1332),
    # South America
    dict(name="Anonymous",     location="São Paulo, Brazil",         latitude=-23.5505, longitude=-46.6333),
    dict(name="Anonymous",     location="Buenos Aires, Argentina",   latitude=-34.6037, longitude=-58.3816),
    dict(name="Anonymous",     location="Bogotá, Colombia",          latitude=4.7110,   longitude=-74.0721),
    dict(name="Anonymous",     location="Santiago, Chile",           latitude=-33.4489, longitude=-70.6693),
    # Asia
    dict(name="Anonymous",     location="Tokyo, Japan",              latitude=35.6762,  longitude=139.6503),
    dict(name="Anonymous",     location="Seoul, South Korea",        latitude=37.5665,  longitude=126.9780),
    dict(name="Anonymous",     location="Singapore",                 latitude=1.3521,   longitude=103.8198),
    dict(name="Anonymous",     location="Mumbai, India",             latitude=19.0760,  longitude=72.8777),
    dict(name="Anonymous",     location="Bangalore, India",          latitude=12.9716,  longitude=77.5946),
    dict(name="Anonymous",     location="Jakarta, Indonesia",        latitude=-6.2088,  longitude=106.8456),
    dict(name="Anonymous",     location="Bangkok, Thailand",         latitude=13.7563,  longitude=100.5018),
    dict(name="Yusuf",         location="Karachi, Pakistan",         latitude=24.8607,  longitude=67.0011),
    dict(name="Anonymous",     location="Dhaka, Bangladesh",         latitude=23.8103,  longitude=90.4125),
    # Middle East
    dict(name="Anonymous",     location="Dubai, UAE",                latitude=25.2048,  longitude=55.2708),
    dict(name="Anonymous",     location="Istanbul, Turkey",          latitude=41.0082,  longitude=28.9784),
    dict(name="Anonymous",     location="Riyadh, Saudi Arabia",      latitude=24.7136,  longitude=46.6753),
    # Oceania
    dict(name="Anonymous",     location="Sydney, Australia",         latitude=-33.8688, longitude=151.2093),
    dict(name="Anonymous",     location="Melbourne, Australia",      latitude=-37.8136, longitude=144.9631),
    dict(name="Anonymous",     location="Auckland, New Zealand",     latitude=-36.8509, longitude=174.7645),
]


class Command(BaseCommand):
    help = "Seed the database with initial content"

    def add_arguments(self, parser):
        parser.add_argument("--flush", action="store_true", help="Delete existing data before seeding")

    def handle(self, *args, **options):
        if options["flush"]:
            self.stdout.write("Flushing existing data...")
            for model in [Memory, Commit, Message, JournalEntry, RoadmapItem, MapPin]:
                model.objects.all().delete()

        self._seed_memories()
        self._seed_commits()
        self._seed_journal()
        self._seed_roadmap()
        self._seed_messages()
        self._seed_home_pin()
        self._seed_map_pins()
        self.stdout.write(self.style.SUCCESS("Seed complete."))

    def _seed_memories(self):
        count = 0
        for m in MEMORIES:
            _, created = Memory.objects.get_or_create(
                title=m["title"],
                defaults={
                    "description": m.get("description", ""),
                    "date": m["date"],
                    "category": m["category"],
                    "quote": m.get("quote", ""),
                    "song": m.get("song", ""),
                    "code_snippet": m.get("code_snippet", ""),
                },
            )
            if created:
                count += 1
        self.stdout.write(f"  Memories: {count} created")

    def _seed_commits(self):
        count = 0
        for c in COMMITS:
            _, created = Commit.objects.get_or_create(
                type=c["type"], scope=c["scope"], message=c["message"],
                defaults={
                    "reflection": c.get("reflection", ""),
                    "timestamp": c["timestamp"],
                    "branch": c.get("branch", "life/main"),
                    "tag": c.get("tag", ""),
                },
            )
            if created:
                count += 1
        self.stdout.write(f"  Commits:  {count} created")

    def _seed_journal(self):
        count = 0
        for j in JOURNAL_ENTRIES:
            _, created = JournalEntry.objects.get_or_create(
                title=j["title"],
                defaults={"content": j["content"], "excerpt": j["excerpt"]},
            )
            if created:
                count += 1
        self.stdout.write(f"  Journal:  {count} created")

    def _seed_roadmap(self):
        count = 0
        for r in ROADMAP_ITEMS:
            _, created = RoadmapItem.objects.get_or_create(
                version=r["version"], text=r["text"],
                defaults={"is_done": r["is_done"], "order": r["order"]},
            )
            if created:
                count += 1
        self.stdout.write(f"  Roadmap:  {count} created")

    def _seed_messages(self):
        count = 0
        for m in SEED_MESSAGES:
            _, created = Message.objects.get_or_create(
                name=m["name"], message=m["message"],
                defaults={"type": m["type"], "location": m.get("location", "")},
            )
            if created:
                count += 1
        self.stdout.write(f"  Messages: {count} created")

    def _seed_home_pin(self):
        _, created = MapPin.objects.get_or_create(
            name=HOME_PIN["name"],
            defaults={
                "location": HOME_PIN["location"],
                "latitude": HOME_PIN["latitude"],
                "longitude": HOME_PIN["longitude"],
            },
        )
        self.stdout.write(f"  Home pin: {'created' if created else 'already exists'}")

    def _seed_map_pins(self):
        count = 0
        for p in MAP_PINS:
            _, created = MapPin.objects.get_or_create(
                location=p["location"],
                defaults={"name": p.get("name", ""), "latitude": p["latitude"], "longitude": p["longitude"]},
            )
            if created:
                count += 1
        self.stdout.write(f"  Map pins: {count} created")
