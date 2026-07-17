import '@root/global-fonts.css';
import '@root/global.css';

import ActionListItem from '@components/ActionListItem';
import BlockLoader from '@components/BlockLoader';
import Card from '@components/Card';
import DebugGrid from '@components/DebugGrid';
import DefaultLayout from '@components/page/DefaultLayout';
import FabActionBar from '@components/FabActionBar';
import FabToolTable, { type FabTool } from '@components/FabToolTable';
import Grid from '@components/Grid';
import ModalStack from '@components/ModalStack';
import FabNav from '@components/FabNav';
import Navigation from '@components/Navigation';
import Row from '@components/Row';
import Text from '@components/Text';
import Window from '@components/Window';
import Accordion from '@components/Accordion';

export const dynamic = 'force-static';

export async function generateMetadata() {
  const title = 'Waterloo Hacker Fab';
  const description = 'Open-source semiconductor fab at the University of Waterloo.';
  const url = 'https://waterloofab.com';

  return {
    title,
    description,
    metadataBase: new URL(url),
    icons: { icon: '/hf-logo.svg', apple: '/hf-logo.svg' },
    openGraph: { title, description, url, type: 'website', images: [{ url: '/hf-logo.png' }] },
    twitter: { card: 'summary', title, description, images: ['/hf-logo.png'] },
  };
}

const TOOLS: FabTool[] = [
  {
    name: 'Lithography Stepper',
    shortName: 'Litho Stepper',
    category: 'Patterning',
    status: 'ACTIVE',
    description:
      'A precision patterning tool that projects UV light through a DLP (Digital Light Processing) chip to expose photoresist-coated substrates with micrometer-level accuracy. A microscope objective focuses the DLP image onto the wafer surface, enabling custom microstructure and integrated circuit fabrication at a fraction of commercial stepper cost.',
    docsUrl: 'https://docs.hackerfab.org/home/fab-toolkit/patterning/lithography-stepper-v2.1',
  },
  {
    name: 'Tube Furnace',
    category: 'Annealing',
    status: 'ACTIVE',
    description:
      'A high-temperature tube furnace capable of exceeding 1000 °C, used for thermal oxidation of silicon (growing SiO₂ gate dielectrics), dopant diffusion (drive-in anneals), and contact annealing. The tubular design allows controlled introduction of process gases — steam for wet oxidation, nitrogen for inert anneals.',
    docsUrl: 'https://docs.hackerfab.org/home/fab-toolkit/annealing/tube-furnace',
  },
  {
    name: 'DC Sputter',
    category: 'Deposition',
    status: 'ACTIVE',
    description:
      'A DC sputtering system that uses a plasma discharge to sputter material from a target onto a substrate. Used to deposit aluminum metal contacts and thin film layers for device fabrication.',
    docsUrl: 'https://docs.hackerfab.org/home/fab-toolkit/deposition/diy-dc-sputtering-wip-uwaterloo',
  },
  {
    name: 'Spin Coater',
    category: 'Deposition',
    status: 'ACTIVE',
    description:
      'A spin coater used to uniformly apply photoresist and other liquid films onto substrates. Spin speed and time control film thickness; the wafer is taped to the chuck to hold it in place during the spin cycle. Essential first step before every lithography exposure.',
    docsUrl: 'https://docs.hackerfab.org/home/standard-operating-procedures/patterning-sop-stepper-v2/spin-coating-sop-rev-2-uwaterloo#spin-coating',
  },
  {
    name: 'Tube Furnace Mfg',
    category: 'Annealing',
    status: 'R & D',
    description:
      'Development of an improved manufacturing method for the tube furnace — focused on tighter temperature uniformity.',
    docsUrl: 'https://docs.hackerfab.org/home/fab-toolkit/annealing/tube-furnace',
  },
  {
    name: 'Quartz Crystal Microbalance',
    shortName: 'QCM',
    category: 'Metrology',
    status: 'R & D',
    description:
      'A quartz crystal microbalance (QCM) monitors thin film deposition in real time by measuring the resonant frequency shift of a piezoelectric quartz crystal as mass accumulates on its surface. Used in-situ during sputtering and evaporation runs to track deposition rate and total film thickness, enabling precise thickness control without breaking vacuum.',
  },
  {
    name: 'Sputter Upgrades',
    category: 'Deposition',
    status: 'R & D',
    description:
      'Upgrade to the existing sputter chamber with improved target cooling (to handle higher power and longer runs) and a better vacuum system for lower base pressure, reducing film contamination and enabling higher-quality oxide and metal depositions.',
    docsUrl: 'https://docs.hackerfab.org/home/fab-toolkit/deposition/diy-dc-sputtering-wip-uwaterloo',
  },
  {
   name: 'RF PSU ',
    category: 'Deposition',
    status: 'R & D',
    description:
      'Design and build of a custom RF power supply for the sputtering system. A purpose-built PSU enables finer control over RF power and matching network tuning, improving plasma stability and deposition rate consistency compared to repurposed commercial units.',
  },
  {
    name: 'Litho Automation',
    shortName: 'Litho Auto',
    category: 'Patterning',
    status: 'R & D',
    description:
      'Software and hardware additions to the lithography stepper for automated alignment — using computer vision to detect alignment marks on the substrate and servo the stage to correct for translation and rotation before exposure. Targets sub-micron overlay accuracy across multiple lithography layers.',
    docsUrl: 'https://docs.hackerfab.org/home/fab-toolkit/patterning/lithography-stepper-v2.1',
  },
  {
    name: 'Atomic Force Microscope',
    shortName: 'AFM',
    category: 'Metrology',
    status: 'R & D',
    description:
      'Build-out of a DIY atomic force microscope for surface metrology — measuring thin film thickness, surface roughness, and step heights at nanometer resolution. Critical for process characterization and verifying film quality without access to commercial metrology tools.',
  },
  {
    name: 'Spectrometer',
    category: 'Metrology',
    status: 'R & D',
    description:
      'An optical spectrometer for in-situ and post-process thin film characterization. Used for reflectometry to measure oxide thickness and for identifying spectral signatures of deposited films. Enables non-destructive process feedback without destructive cross-section analysis.',
    docsUrl: 'https://docs.hackerfab.org/home/fab-toolkit/metrology-characterization/spectrometer',
  },
  {
    name: 'Reflectometer',
    category: 'Metrology',
    status: 'R & D',
    description:
      'A non-destructive optical measurement tool for determining thin-film thickness from reflected light, enabling faster process characterization and feedback.',
  },
  {
    name: 'Process Development',
    shortName: 'Process Dev',
    category: 'Process',
    status: 'R & D',
    description:
      'Development of wet chemical etch processes — HF-based oxide etches, metal etchants, and developer chemistry optimization — along with systematic process tuning for resist adhesion, exposure dose, bake temperatures, and etch selectivity to improve overall device yield.',
  },
  {
    name: 'Vacuum Chuck',
    category: 'Deposition',
    status: 'R & D',
    description:
      'Development of a DIY vacuum chuck to replace the current taped-chuck setup on the spin coater. A vacuum chuck holds wafers and dies securely by suction, improving centering and repeatability across spin coating runs.',
  },
  {
    name: 'Probe Station',
    category: 'Metrology',
    status: 'R & D',
    description:
      'A probe station is a nanoscale multimeter for testing chips after fabrication — probe needles physically contact pads on the chip to measure electrical characteristics like I-V curves, verifying whether the device works. As part of the Hacker Fab goal of open-sourcing every nanofabrication tool, we are developing a DIY probe station.',
  },
];

const FAQ = [
  {
    q: 'What is Hacker Fab and what do you do?',
    a: 'We are developing open-source microfabrication machines and processes to build conventionally expensive and inaccessible hardware from scratch.',
  },
  {
    q: 'Who can join the team and what qualifications do i need?',
    a: "We're looking for a small number of passionate students across various disciplines including mechanical engineering, electrical engineering, physics, chemistry, nano. Since our team is small, you'll have significant control over what you work on. The work is divided into teams, which determine what specific project (i.e. tool for fabrication) you will work on. No specific qualifications are required - we value dedication and smart thinking over credentials. Because of the nature of our team, you will also end up getting hands on engineering experience, doing everything from designing the projects to actually building them out."
  },
  {
    q: 'What projects will I work on here?',
    a: "You'll work on building the tools to make chips. This includes developing lithography stepper for projecting patterns of design onto silicon, tube furnace for heating up gases to +1000 degrees in order to dope silicon, reactive ion etcher and designing tools & processes to characteriz our chips. These are just a few of the projects we have active. Over time, more will be added as we move towards the goal of having a complete fabrication process with enough precision and tools to make everything from transistors to more complicated ICs.",
  },
  {
    q: 'How do I get involved or contribute?',
    a: 'Email us at waterloohackerfab@gmail.com. We are always looking for students interested in building fab equipment, developing processes, or doing device research.',
  },
];

export default async function Page() {
  return (
    <DefaultLayout previewPixelSRC="/favicon-32x32.png">
      <DebugGrid />
      <FabActionBar />
      <ModalStack />

      <Navigation
        logo={<span style={{ fontWeight: 700, fontStyle: 'italic' }}>HACKER FAB</span>}
        logoHref="/"
        right={<FabNav />}
      />

      <Grid style={{ paddingBottom: '0.5ch' }}>
        <Row>
          <Text>
          The HACKER FAB at Waterloo, is an open-source semiconductor fab at the University of Waterloo's Sedra Design Center. We design, build and operate patterning, deposition, and characterization equipment enabling students to fabricate real devices from scratch and gain exposure to open-ended engineering problems.
          </Text>
        </Row>
        <br/>
        <Row>
          <Text>
            Part of the global{' '}
            <a href="https://hackerfab.org" target="_blank" rel="noopener noreferrer">
              Hacker Fab
            </a>{' '}
            network, our process docs & build guides live on the {' '}
            <a href="https://docs.hackerfab.org" target="_blank" rel="noopener noreferrer">
              Hacker Fab wiki
            </a>
            .
          </Text>
        </Row>
      </Grid>

      <Grid>
        <Row style={{ fontWeight: 600, marginBottom: '3px' }}>EQUIPMENT</Row>
        <Window>
          <Card title={<span style={{ display: 'flex', alignItems: 'center', gap: '1ch' }}>EQUIPMENT STATUS <BlockLoader mode={1} /></span>} mode="left">
            <FabToolTable tools={TOOLS} separatorAfter={4} />
          </Card>
        </Window>
      </Grid>


      <Grid id="faq">
        <Row style={{ fontWeight: 600, marginBottom: '3px' }}>FAQ</Row>
        {FAQ.map(({ q, a }) => (
          <Accordion key={q} title={q}>
            <div style={{ background: 'var(--theme-border)', padding: '1ch 1ch 1ch 1ch', margin: '0 0 0 -1ch' }}>
              <Text>{a}</Text>
            </div>
          </Accordion>
        ))}
      </Grid>

      <Grid id="sponsor">
        <Row style={{ fontWeight: 600, marginBottom: '3px' }}>SPONSORSHIP</Row>
        <Row>
          <Text>
            Hacker Fab sees sponsorship as a way to build stronger relationships between our sponsor companies and Waterloo’s student ecosystem.
            Students here complete 5-6 co-ops throughout their degree, creating a constant flow of technical talent between the university and companies worldwide.
            We help sponsors tap into this through events, student engagement, lab demos, and introductions to strong technical talent. 
            <br />
            <br />
            Sponsored tools can be named after your company, and sponsors are recognized on our website, in LinkedIn posts, and by HackerFab members.
          </Text>
        </Row>
        <br />
        <ActionListItem
          icon="⭢"
          href="https://docs.google.com/document/d/1br1uqPcKH3_II-7GZcfvDpuFsgBN5H3fRLDFnIcEbh0/edit?usp=sharing"
          target="_blank"
        >
          Sponsorship Deck
        </ActionListItem>
      </Grid>

      <Grid id="contact">
        <Row style={{ fontWeight: 600, marginBottom: '3px' }}>CONTACT</Row>
        <ActionListItem icon="⭢" href="mailto:waterloohackerfab@gmail.com">
          waterloohackerfab@gmail.com
        </ActionListItem>
        <ActionListItem icon="⭢" href="https://discord.gg/hacker-fab-1143959339179200562" target="_blank">
          Discord
        </ActionListItem>
        <ActionListItem
          icon="⊹"
          href="https://maps.app.goo.gl/UcKTWBqJWAMLfbE97"
          target="_blank"
        >
          E5-2001, University of Waterloo, Waterloo ON
        </ActionListItem>
      </Grid>

    </DefaultLayout>
  );
}
