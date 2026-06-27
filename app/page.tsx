import '@root/global-fonts.css';
import '@root/global.css';

import ActionListItem from '@components/ActionListItem';
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
  const description = 'Open-access semiconductor fabrication lab at the University of Waterloo.';
  const url = 'https://waterloofab.com';

  return {
    title,
    description,
    metadataBase: new URL(url),
    icons: { icon: '/hf-logo.svg', apple: '/hf-logo.svg' },
    openGraph: { title, description, url, type: 'website' },
    twitter: { card: 'summary', title, description },
  };
}

const TOOLS: FabTool[] = [
  {
    name: 'DLP UV Lithography Stepper',
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
    name: 'Sputter Coater',
    category: 'Deposition',
    status: 'ACTIVE',
    description:
      'An RF sputtering system operating at 14 MHz that uses plasma to sputter material from a target onto a substrate. Capable of depositing both aluminum metal contacts and aluminum oxide dielectric layers in a single chamber, enabling gate stack fabrication. Reactive sputtering with oxygen allows direct deposition of oxide films.',
    docsUrl: 'https://docs.hackerfab.org/home/fab-toolkit/deposition/diy-rf-sputtering-chamber',
  },
  {
    name: 'Spin Coater',
    category: 'Deposition',
    status: 'ACTIVE',
    description:
      'A vacuum-chuck spin coater used to uniformly apply photoresist and other liquid films onto substrates. Spin speed and time control film thickness; the vacuum chuck holds wafers and dies securely during the spin cycle. Essential first step before every lithography exposure.',
    docsUrl: 'https://docs.hackerfab.org/home/fab-toolkit/deposition/spin-coater-v2-build-work-in-progress',
  },
  {
    name: 'Tube Furnace Mfg Method',
    category: 'Annealing',
    status: 'IN PROGRESS',
    description:
      'Development of an improved manufacturing method for the tube furnace — focused on tighter temperature uniformity, better sealing for process gas control, and a lower-cost build path to enable other Hacker Fab nodes to replicate the tool.',
    docsUrl: 'https://docs.hackerfab.org/home/fab-toolkit/annealing/tube-furnace',
  },
  {
    name: 'Quartz Crystal Microbalance',
    category: 'Metrology',
    status: 'IN PROGRESS',
    description:
      'A quartz crystal microbalance (QCM) monitors thin film deposition in real time by measuring the resonant frequency shift of a piezoelectric quartz crystal as mass accumulates on its surface. Used in-situ during sputtering and evaporation runs to track deposition rate and total film thickness, enabling precise thickness control without breaking vacuum.',
  },
  {
    name: 'Sputter Upgrades',
    category: 'Deposition',
    status: 'IN PROGRESS',
    description:
      'Upgrade to the existing sputter chamber with improved target cooling (to handle higher power and longer runs) and a better vacuum system for lower base pressure, reducing film contamination and enabling higher-quality oxide and metal depositions.',
    docsUrl: 'https://docs.hackerfab.org/home/fab-toolkit/deposition/diy-dc-sputtering-wip-uwaterloo',
  },
  {
   name: 'RF PSU ',
    category: 'Deposition',
    status: 'IN PROGRESS',
    description:
      'Design and build of a custom RF power supply for the sputtering system. A purpose-built PSU enables finer control over RF power and matching network tuning, improving plasma stability and deposition rate consistency compared to repurposed commercial units.',
  },
  {
    name: 'Litho Automation',
    category: 'Patterning',
    status: 'IN PROGRESS',
    description:
      'Software and hardware additions to the lithography stepper for automated alignment — using computer vision to detect alignment marks on the substrate and servo the stage to correct for translation and rotation before exposure. Targets sub-micron overlay accuracy across multiple lithography layers.',
    docsUrl: 'https://docs.hackerfab.org/home/fab-toolkit/patterning/lithography-stepper-v2.1',
  },
  {
    name: 'Atomic Force Microscope',
    category: 'Metrology',
    status: 'IN PROGRESS',
    description:
      'Build-out of a DIY atomic force microscope for surface metrology — measuring thin film thickness, surface roughness, and step heights at nanometer resolution. Critical for process characterization and verifying film quality without access to commercial metrology tools.',
  },
  {
    name: 'Spectrometer',
    category: 'Metrology',
    status: 'IN PROGRESS',
    description:
      'An optical spectrometer for in-situ and post-process thin film characterization. Used for reflectometry to measure oxide thickness and for identifying spectral signatures of deposited films. Enables non-destructive process feedback without destructive cross-section analysis.',
    docsUrl: 'https://docs.hackerfab.org/home/fab-toolkit/metrology-characterization/spectrometer',
  },
  {
    name: 'Process Development',
    category: 'Process',
    status: 'IN PROGRESS',
    description:
      'Development of wet chemical etch processes — HF-based oxide etches, metal etchants, and developer chemistry optimization — along with systematic process tuning for resist adhesion, exposure dose, bake temperatures, and etch selectivity to improve overall device yield.',
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
    q: 'Do I need training before using the tools?',
    a: 'Yes. All users must complete a safety orientation and tool-specific training before operating equipment independently.',
  },
  {
    q: 'What projects will I work on here?',
    a: "You'll work on building chips from scratch using our open-source fabrication tools. This includes developing lithography stepper for projecting patterns of design onto silicon, tube furnace for heating up gases to +1000 degrees in order to dope silicon, reactive ion etcher. These are just a few of the projects we have active. Over time, more will be added as we move towards the goal of having a complete fabrication process with enough precision and tools to make everything from transistors to more complicated ICs.",
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

      <Grid>
        <Row>The HACKER FAB at Waterloo,</Row>
        <Row>
          <Text>
            is an open-access semiconductor fabrication facility at the University of Waterloo's Sedra Design Center. We design, build and operate patterning, deposition, and characterization equipment enabling students to fabricate real devices from scratch and gain exposure to open-ended engineering problems.
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
        <Row style={{ fontWeight: 600 }}>EQUIPMENT</Row>
        <br/>
        <Window>
          <Card title="EQUIPMENT STATUS" mode="left">
            <FabToolTable tools={TOOLS} separatorAfter={4} />
          </Card>
        </Window>
      </Grid>


      <Grid id="media">
        <Row style={{ fontWeight: 600 }}>Media</Row>
        <br/>
        <Row>
          <Text style={{ opacity: 0.5 }}>Coming soon.</Text>
        </Row>
      </Grid>

      <Grid id="faq">
        <Row style={{ fontWeight: 600 }}>FAQ</Row>
        <br />
        {FAQ.map(({ q, a }) => (
          <Accordion key={q} title={q}>
            <div style={{ background: 'var(--theme-border)', padding: '1ch 1ch 1ch 1ch', margin: '0 0 0 -1ch' }}>
              <Text>{a}</Text>
            </div>
          </Accordion>
        ))}
      </Grid>

      <Grid id="contact">
        <Row>CONTACT</Row>
        <ActionListItem icon="⭢" href="mailto:waterloohackerfab@gmail.com">
          waterloohackerfab@gmail.com
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
