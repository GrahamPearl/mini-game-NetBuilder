/* ===== 1. ASSET & MEDIA REGISTRY: set a URL/data-URI to override art; null = built-in vector art ===== */
const ASSET_CONFIG = {
  bg: null,
  sprites: {
    server: null,
    pc: null,
    printer: null,
    laptop: null,
    iot: null,
    sw4: null,
    sw8: null,
    router: null,
    gateway: null,
    firewall: null,
    ap: null,
    net: null,
  },
};
const ART = { bg: null, img: {} };
/* ===== 2. CONSTANTS, LEVELS & STUDY NOTES ===== */
const EP = ["pc", "printer", "laptop", "iot"],
  CELL = 38,
  WR = 4.5,
  SPD = [1, 2, 0.5];
const CAB = {
  cat5e: { c: 2, s: 0.011, col: "#94a3b8" },
  cat6: { c: 3, s: 0.015, col: "#38bdf8" },
  cat6a: { c: 6, s: 0.024, col: "#2dd4bf" },
  fibre: { c: 10, s: 0.036, col: "#f59e0b" },
};
const DEV = {
  sw4: { n: "4-Switch", p: 4, $: 80, col: "#a855f7", ic: "SW" },
  sw8: { n: "8-Switch", p: 8, $: 130, col: "#c084fc", ic: "S8" },
  router: { n: "Router", p: 4, $: 160, col: "#f97316", ic: "RT" },
  gateway: { n: "Gateway", p: 4, $: 210, col: "#ec4899", ic: "GW" },
  firewall: { n: "Firewall", p: 2, $: 150, col: "#ef4444", ic: "FW" },
  ap: { n: "Wi-Fi AP", p: 2, $: 110, col: "#06b6d4", ic: "AP" },
  sw32: {
    n: "32-Port Ethernet Switch",
    p: 32,
    $: 420,
    col: "#d8b4fe",
    ic: "S32",
  },
  sw64: {
    n: "64-Port Ethernet Switch",
    p: 64,
    $: 780,
    col: "#e9d5ff",
    ic: "S64",
  },
  fr4: { n: "4-Port Fibre Router", p: 4, $: 350, col: "#fb923c", ic: "F4" },
  fr8: { n: "8-Port Fibre Router", p: 8, $: 520, col: "#fdba74", ic: "F8" },
  fr32: {
    n: "32-Port Fibre Router",
    p: 32,
    $: 1400,
    col: "#fed7aa",
    ic: "F32",
  },
  fr64: {
    n: "64-Port Fibre Router",
    p: 64,
    $: 2600,
    col: "#ffedd5",
    ic: "F64",
  },
  ups: { n: "UPS (battery backup)", p: 0, $: 120, col: "#84cc16", ic: "UPS" },
};
const GRP = (k) =>
    k.startsWith("sw")
      ? "sw"
      : k == "firewall"
        ? "fw"
        : k == "ap"
          ? "ap"
          : k == "ups"
            ? "ups"
            : "rt",
  GL = {
    sw: "Ethernet Switches",
    rt: "Routers & Fibre Routers",
    fw: "Security",
    ap: "Wireless",
    ups: "Power (UPS)",
  },
  PR = 5;
const FIX = {
  server: ["#22c55e", "SV"],
  pc: ["#60a5fa", "PC"],
  printer: ["#e2e8f0", "PR"],
  laptop: ["#38bdf8", "LT"],
  iot: ["#facc15", "IoT"],
  net: ["#a78bfa", "WWW"],
};
const R = (x, y, w, h, name) => ({ name, x, y, w, h }),
  W = (x1, y1, x2, y2) => ({ x1, y1, x2, y2 });
const N = (id, type, label, x, y, w) => ({
  id,
  type,
  label,
  x,
  y,
  ip: type == "server" ? "192.168.1.1" : type == "net" ? "203.0.113.5" : null,
  wireless: !!w,
});
const SRV = N("srv_1", "server", "Server", 16, 6);
const L = (id, title, tag, brief, obj, budget, layouts, req, demo) => ({
  id,
  title,
  tag,
  brief,
  obj,
  budget,
  drill: 50,
  roof: 25,
  mpc: 2,
  layouts,
  req,
  demo,
  start: { id: 10, prn: 50, iot: 80, inc: 1 },
});
const LEVELS = [
  L(
    1,
    "1 · Star Topology & Wall vs Roof",
    "Checkpoint: LAN, star topology, switch, cable cost",
    "Join PC-01, PC-02 and the Printer to the Server through a 4-Switch (a star). Compare Along-Wall and Through-Roof costs.",
    [
      "Deliver every packet to the Server",
      "Give each device a unique IPv4 address",
      "Stay within $420",
      "Use a switch to build a star",
    ],
    420,
    [
      {
        id: "a",
        name: "Layout A: Open Studio",
        rooms: [R(1, 1, 18, 10, "Main Studio")],
        walls: [],
        nodes: [
          SRV,
          N("pc_1", "pc", "PC-01", 4, 4),
          N("pc_2", "pc", "PC-02", 4, 8),
          N("prn_1", "printer", "Printer", 10, 9),
        ],
      },
      {
        id: "b",
        name: "Layout B: Divided Wing",
        rooms: [R(1, 1, 10, 10, "Workroom"), R(11, 1, 8, 10, "Server Room")],
        walls: [W(11, 1, 11, 11)],
        nodes: [
          SRV,
          N("pc_1", "pc", "PC-01", 4, 3),
          N("pc_2", "pc", "PC-02", 4, 8),
          N("prn_1", "printer", "Printer", 8, 8),
        ],
      },
    ],
    { dev: ["sw4"] },
    {
      mode: "roof",
      devs: [["s1", "sw4", 11, 6]],
      links: [
        ["pc_1", "s1", "cat5e"],
        ["pc_2", "s1", "cat5e"],
        ["prn_1", "s1", "cat5e"],
        ["s1", "srv_1", "cat6"],
      ],
    },
  ),
  L(
    2,
    "2 · Wi-Fi, Laptops & IoT",
    "Checkpoint: wireless LAN, access points, wired vs wireless",
    "Place a Wi-Fi AP so the Laptop and IoT camera (inside its coverage circle) reach the Server alongside PC-01 and the Printer.",
    [
      "Place a Wi-Fi AP within range of Laptop and IoT",
      "Cable the AP to the network (it needs a wired uplink)",
      "Unique IPv4 addresses, stay within $700",
    ],
    700,
    [
      {
        id: "a",
        name: "Layout A: Smart Lounge",
        rooms: [R(1, 1, 12, 10, "Smart Lounge"), R(13, 1, 6, 10, "Server Bay")],
        walls: [W(13, 1, 13, 11)],
        nodes: [
          SRV,
          N("pc_1", "pc", "PC-01", 3, 3),
          N("prn_1", "printer", "Printer", 3, 9),
          N("lap_1", "laptop", "Laptop", 8, 3, 1),
          N("iot_1", "iot", "IoT-Cam", 9, 8, 1),
        ],
      },
    ],
    { dev: ["ap"] },
    {
      mode: "roof",
      devs: [
        ["s1", "sw4", 11, 6],
        ["ap1", "ap", 9, 6],
      ],
      links: [
        ["pc_1", "s1", "cat5e"],
        ["prn_1", "s1", "cat5e"],
        ["ap1", "s1", "cat6"],
        ["s1", "srv_1", "fibre"],
      ],
    },
  ),
  L(
    3,
    "3 · Router, Subnets & IP Addressing",
    "Checkpoint+IGCSE: router, IPv4, DHCP, 8-port switch",
    "Link a busy office through an 8-Switch and a Router to the Server. Use Cat6a or Fibre on the fast uplink. Watch DHCP: duplicate IPs cause conflicts!",
    [
      "Include an 8-Switch, a Router and a Wi-Fi AP",
      "All traffic must pass through the Router",
      "Use Cat6a or Fibre on one link, stay within $1100",
    ],
    1100,
    [
      {
        id: "a",
        name: "Layout A: Enterprise Wing",
        rooms: [R(1, 1, 9, 10, "Office Wing"), R(10, 1, 9, 10, "Core Hall")],
        walls: [W(10, 1, 10, 11)],
        nodes: [
          SRV,
          N("pc_1", "pc", "PC-01", 3, 3),
          N("pc_2", "pc", "PC-02", 7, 3),
          N("prn_1", "printer", "Printer", 3, 9),
          N("lap_1", "laptop", "Laptop", 7, 7, 1),
          N("iot_1", "iot", "IoT-Hub", 7, 9, 1),
        ],
      },
    ],
    { dev: ["sw8", "router", "ap"], path: ["router"], cab: ["cat6a", "fibre"] },
    {
      mode: "roof",
      devs: [
        ["sw", "sw8", 8, 6],
        ["ap1", "ap", 6, 8],
        ["rt", "router", 12, 6],
      ],
      links: [
        ["pc_1", "sw", "cat5e"],
        ["pc_2", "sw", "cat5e"],
        ["prn_1", "sw", "cat5e"],
        ["ap1", "sw", "cat5e"],
        ["sw", "rt", "cat6a"],
        ["rt", "srv_1", "fibre"],
      ],
    },
  ),
  L(
    4,
    "4 · Firewall & Network Security",
    "IGCSE: firewalls, security, protecting a network",
    "Protect the Server: all traffic from the office must pass through a Firewall before it reaches the Server.",
    [
      "Include a 4-Switch and a Firewall",
      "Every packet must travel through the Firewall",
      "Stay within $900",
    ],
    900,
    [
      {
        id: "a",
        name: "Layout A: Secure Office",
        rooms: [R(1, 1, 10, 10, "Office"), R(11, 1, 8, 10, "Server Room")],
        walls: [W(11, 1, 11, 11)],
        nodes: [
          SRV,
          N("pc_1", "pc", "PC-01", 3, 4),
          N("pc_2", "pc", "PC-02", 3, 8),
          N("prn_1", "printer", "Printer", 5, 9),
        ],
      },
    ],
    { dev: ["sw4", "firewall"], path: ["firewall"] },
    {
      mode: "roof",
      devs: [
        ["sw", "sw4", 7, 6],
        ["fw", "firewall", 11, 6],
      ],
      links: [
        ["pc_1", "sw", "cat5e"],
        ["pc_2", "sw", "cat5e"],
        ["prn_1", "sw", "cat5e"],
        ["sw", "fw", "cat6"],
        ["fw", "srv_1", "cat6"],
      ],
    },
  ),
  L(
    5,
    "5 · Resilient Ring & Mesh",
    "IGCSE: topology trade-offs, redundancy, mesh/hybrid",
    "Build backup links! Use two switches and the Server in a loop so that if any one backbone cable is cut, everything still works.",
    [
      "Use two 4-Switches",
      "Link the switches and Server in a loop (3 backbone cables)",
      "Network survives any single backbone cable cut, within $1000",
    ],
    1000,
    [
      {
        id: "a",
        name: "Layout A: Campus Hall",
        rooms: [R(1, 1, 18, 10, "Campus Hall")],
        walls: [],
        nodes: [
          SRV,
          N("pc_1", "pc", "PC-01", 3, 3),
          N("pc_2", "pc", "PC-02", 3, 8),
          N("prn_1", "printer", "Printer", 11, 9),
        ],
      },
    ],
    { dev: ["sw4", "sw4"], red: 1 },
    {
      mode: "roof",
      devs: [
        ["sa", "sw4", 8, 4],
        ["sb", "sw4", 8, 8],
      ],
      links: [
        ["pc_1", "sa", "cat5e"],
        ["pc_2", "sb", "cat5e"],
        ["prn_1", "sb", "cat5e"],
        ["sa", "sb", "cat6"],
        ["sa", "srv_1", "cat6"],
        ["sb", "srv_1", "cat6"],
      ],
    },
  ),
  L(
    6,
    "6 · Campus to the Internet (WAN)",
    "IGCSE: LAN vs WAN, public/private IP, routers, packets",
    "Connect the campus LAN to the Internet (a WAN). Traffic leaves through a Router and a Firewall. Note: 192.168.x.x addresses are private; the Internet node has a public IP.",
    [
      "Include a switch, Router, Firewall and Wi-Fi AP",
      "Packets pass through the Router AND the Firewall to the Internet",
      "Stay within $1200",
    ],
    1200,
    [
      {
        id: "a",
        name: "Layout A: Campus Edge",
        rooms: [R(1, 1, 12, 10, "Campus LAN"), R(13, 1, 6, 10, "Edge")],
        walls: [W(13, 1, 13, 11)],
        nodes: [
          N("net_1", "net", "Internet", 17, 6),
          N("pc_1", "pc", "PC-01", 3, 4),
          N("pc_2", "pc", "PC-02", 3, 8),
          N("lap_1", "laptop", "Laptop", 6, 6, 1),
        ],
      },
    ],
    {
      dev: ["sw4", "router", "firewall", "ap"],
      path: ["router", "firewall"],
      target: "net_1",
    },
    {
      mode: "roof",
      devs: [
        ["ap1", "ap", 5, 6],
        ["sw", "sw4", 8, 6],
        ["rt", "router", 11, 6],
        ["fw", "firewall", 14, 6],
      ],
      links: [
        ["pc_1", "sw", "cat5e"],
        ["pc_2", "sw", "cat5e"],
        ["ap1", "sw", "cat5e"],
        ["sw", "rt", "cat6"],
        ["rt", "fw", "cat6"],
        ["fw", "net_1", "fibre"],
      ],
    },
  ),
];
LEVELS.push(
  L(
    7,
    "7 · Ethernet Switch Config (VLANs)",
    "IGCSE: managed switches, ports, VLANs, management IP, CLI",
    "Wire the star with a managed 8-Switch, then click ⚙ Configure and the switch. In its console: set a management IP, put every USED port in VLAN 10 (type show to see which port is which) and shut down an unused port.",
    [
      "Place an 8-Switch and deliver all packets",
      "Set a management IP and VLAN 10 on the used ports",
      "Shut down one unused port, stay within $600",
    ],
    600,
    [
      {
        id: "a",
        name: "Layout A: Managed Office",
        rooms: [R(1, 1, 18, 10, "Main Studio")],
        walls: [],
        nodes: [
          SRV,
          N("pc_1", "pc", "PC-01", 4, 4),
          N("pc_2", "pc", "PC-02", 4, 8),
          N("prn_1", "printer", "Printer", 10, 9),
        ],
      },
    ],
    {
      dev: ["sw8"],
      cfg: [
        ["sw", "ip"],
        ["sw", "vlan", 10],
        ["sw", "down"],
      ],
    },
    {
      mode: "roof",
      devs: [["sw", "sw8", 11, 6]],
      links: [
        ["pc_1", "sw", "cat5e"],
        ["pc_2", "sw", "cat5e"],
        ["prn_1", "sw", "cat5e"],
        ["sw", "srv_1", "cat6"],
      ],
      cli: [
        ["sw", "ip address 192.168.1.250 255.255.255.0"],
        ["sw", "port 1 vlan 10"],
        ["sw", "port 2 vlan 10"],
        ["sw", "port 3 vlan 10"],
        ["sw", "port 4 vlan 10"],
        ["sw", "port 8 shutdown"],
      ],
    },
  ),
  L(
    8,
    "8 · Fibre Router, DHCP Pool & Static Route",
    "IGCSE: routers, fibre uplinks, DHCP pools, static/default routes",
    "Add a 4-Port Fibre Router with a fibre uplink to the Server. An unconfigured router drops traffic! In its console set an IP address, a DHCP pool and a default route (ip route 0.0.0.0 0.0.0.0 <next-hop>).",
    [
      "Use a 4-Switch and a 4-Port Fibre Router with a fibre link",
      "Configure the router: IP, DHCP pool, default route",
      "All traffic passes the router, stay within $1200",
    ],
    1200,
    [
      {
        id: "a",
        name: "Layout A: Branch Office",
        rooms: [R(1, 1, 18, 10, "Branch Office")],
        walls: [],
        nodes: [
          SRV,
          N("pc_1", "pc", "PC-01", 3, 3),
          N("pc_2", "pc", "PC-02", 3, 8),
          N("prn_1", "printer", "Printer", 5, 10),
        ],
      },
    ],
    {
      dev: ["sw4", "fr4"],
      path: ["fr4"],
      cab: ["fibre"],
      cfg: [
        ["rt", "ip"],
        ["rt", "pool"],
        ["rt", "route", "0.0.0.0"],
      ],
    },
    {
      mode: "roof",
      devs: [
        ["sw", "sw4", 7, 6],
        ["fr", "fr4", 11, 6],
      ],
      links: [
        ["pc_1", "sw", "cat5e"],
        ["pc_2", "sw", "cat5e"],
        ["prn_1", "sw", "cat5e"],
        ["sw", "fr", "cat6"],
        ["fr", "srv_1", "fibre"],
      ],
      cli: [
        ["fr", "ip address 192.168.1.254 255.255.255.0"],
        ["fr", "dhcp pool 192.168.1.10 192.168.1.100"],
        ["fr", "ip route 0.0.0.0 0.0.0.0 192.168.1.1"],
      ],
    },
  ),
  L(
    9,
    "9 · Power Outage & UPS",
    "IGCSE: UPS, resilience, business continuity",
    "The mains fails! Place a UPS (range 5 cells, 6 outlets) so the switch, Wi-Fi AP and Server keep running. Use ⚡ Power Outage to practise; Run Test also simulates the outage.",
    [
      "Place a 4-Switch, a Wi-Fi AP and a UPS",
      "Keep the switch, AP and Server inside the UPS range",
      "Deliver all packets during the outage, stay within $800",
    ],
    800,
    [
      {
        id: "a",
        name: "Layout A: Server Corner",
        rooms: [R(1, 1, 18, 10, "Office Floor")],
        walls: [],
        nodes: [
          SRV,
          N("pc_1", "pc", "PC-01", 3, 4),
          N("prn_1", "printer", "Printer", 5, 9),
          N("lap_1", "laptop", "Laptop", 7, 8, 1),
        ],
      },
    ],
    { dev: ["ups", "sw4", "ap"], ups: 1 },
    {
      mode: "roof",
      devs: [
        ["sw", "sw4", 9, 6],
        ["ap1", "ap", 7, 6],
        ["ups1", "ups", 12, 6],
      ],
      links: [
        ["pc_1", "sw", "cat5e"],
        ["prn_1", "sw", "cat5e"],
        ["ap1", "sw", "cat5e"],
        ["sw", "srv_1", "cat6"],
      ],
    },
  ),
);
const NOTES = [
  [
    "Topologies",
    [
      [
        "Star, Bus, Ring, Mesh, Hybrid",
        "Star: every device has its own cable to a central switch (one failure affects one device). Bus: one shared backbone. Ring: a closed loop. Mesh: many redundant links, resilient but costly. Hybrid combines types.",
        "Redundancy vs cost",
        "Network topology",
        "Network_topology",
      ],
      [
        "Along Wall vs Through Roof",
        "Along Wall follows room edges and charges a drill fee for each wall crossed. Through Roof goes straight overhead with ceiling-drop fees.",
        "Cost trade-off",
        "Structured cabling",
        "Structured_cabling",
      ],
    ],
  ],
  [
    "Media & Wireless",
    [
      [
        "Cat5e / Cat6 / Cat6a copper",
        "Twisted pairs cancel interference (crosstalk). Higher categories cost more and handle faster speeds.",
        "$2 / $3 / $6 per m",
        "Twisted pair",
        "Twisted_pair",
      ],
      [
        "Fibre optic",
        "Pulses of light in glass: very fast, long range, immune to electromagnetic interference.",
        "$10 per m",
        "Optical fiber",
        "Optical_fiber",
      ],
      [
        "Wi-Fi Access Point & NIC",
        "An AP gives wireless devices (each has a NIC) a connection to the wired LAN. Coverage radius is 4.5 cells and the AP must be cabled.",
        "Wireless LAN",
        "Wireless access point",
        "Wireless_access_point",
      ],
    ],
  ],
  [
    "Devices & IP",
    [
      [
        "Switch, Router, Gateway",
        "A switch forwards frames to the right port inside a LAN. A router forwards packets between networks using IP addresses. A gateway links different networks or protocols.",
        "Switch = LAN, Router = between networks",
        "Network switch",
        "Network_switch",
      ],
      [
        "IPv4 & DHCP",
        "IPv4 uses four numbers 0-255 (e.g. 192.168.1.10). DHCP hands out addresses automatically. Two devices with one IP cause an IP conflict. Private ranges (192.168.x.x) are not routed on the Internet; the MAC address is the fixed hardware address of a NIC.",
        "Unique IP per device",
        "Dynamic Host Configuration Protocol",
        "Dynamic_Host_Configuration_Protocol",
      ],
    ],
  ],
  [
    "Config & Power",
    [
      [
        "VLANs & managed switches",
        "A VLAN splits one physical switch into separate logical networks. Ports in different VLANs cannot talk unless trunked. Unused ports can be shut down for security.",
        "port 1 vlan 10 | port 8 shutdown",
        "VLAN",
        "VLAN",
      ],
      [
        "Routers, static routes & DHCP pools",
        "A router needs an IP address and a route telling it where to send traffic; the default route 0.0.0.0 matches everything else. A DHCP pool is the range of addresses it hands out. Fibre routers terminate light-based uplinks.",
        "ip route 0.0.0.0 0.0.0.0 <next-hop>",
        "Static routing",
        "Static_routing",
      ],
      [
        "UPS (uninterruptible power supply)",
        "A UPS holds a battery that keeps critical devices running during a mains failure, giving time for a clean shutdown or to ride out short cuts.",
        "Range 5 cells, 6 outlets",
        "Uninterruptible power supply",
        "Uninterruptible_power_supply",
      ],
    ],
  ],
  [
    "Security & WAN",
    [
      [
        "Firewall",
        "Monitors incoming and outgoing traffic and blocks anything that breaks security rules, protecting a network from attacks.",
        "Security",
        "Firewall (computing)",
        "Firewall_(computing)",
      ],
      [
        "LAN vs WAN & Packet Switching",
        "A LAN covers a small area; a WAN (like the Internet) spans cities or countries. Data is split into packets that can take different routes and are re-assembled at the destination.",
        "Packets, headers, routing",
        "Packet switching",
        "Packet_switching",
      ],
    ],
  ],
];
const QZ = [
  [
    "C",
    "Which topology connects every device to a central switch?",
    ["Bus", "Star", "Ring", "Mesh"],
    1,
    "In a star each device has its own cable to the switch.",
  ],
  [
    "C",
    "What does a switch do?",
    [
      "Sends data only to the intended device",
      "Stores web pages",
      "Blocks viruses",
      "Converts light to heat",
    ],
    0,
    "A switch learns which device is on which port and forwards data only there.",
  ],
  [
    "C",
    "Which cable sends data as pulses of light?",
    ["Cat5e", "Cat6", "Fibre optic", "Cat6a"],
    2,
    "Fibre uses light in glass strands, so it is immune to electrical interference.",
  ],
  [
    "C",
    "What is a Wi-Fi access point for?",
    [
      "Printing documents",
      "Letting wireless devices join a wired network",
      "Storing files",
      "Assigning MAC addresses",
    ],
    1,
    "The AP bridges wireless devices to the wired LAN.",
  ],
  [
    "C",
    "Which is a valid IPv4 address?",
    ["192.168.1.10", "192.168.1", "FF:EE:DD:CC", "www.school.com"],
    0,
    "IPv4 has four numbers from 0 to 255 separated by dots.",
  ],
  [
    "C",
    "What happens if two devices have the same IP address?",
    [
      "Nothing",
      "An IP conflict: data may go to the wrong device",
      "Internet gets faster",
      "The switch resets",
    ],
    1,
    "Each device on a network needs a unique IP.",
  ],
  [
    "I",
    "What does a router do?",
    [
      "Forwards packets between networks using IP addresses",
      "Boosts Wi-Fi signal only",
      "Stores MAC addresses only",
      "Encrypts all files",
    ],
    0,
    "Routers connect networks and choose the path for each packet.",
  ],
  [
    "I",
    "What does a firewall do?",
    [
      "Speeds up downloads",
      "Monitors traffic and blocks it according to security rules",
      "Assigns IP addresses",
      "Cools servers",
    ],
    1,
    "Firewalls check traffic against rules to stop unauthorised access.",
  ],
  [
    "I",
    "Main advantage of a mesh topology?",
    [
      "Cheapest to build",
      "Redundant paths keep working if a link fails",
      "Needs no cables",
      "Only one path",
    ],
    1,
    "Many links give resilience but cost more cable and ports.",
  ],
  [
    "I",
    "What is packet switching?",
    [
      "Data is split into packets that may take different routes",
      "One dedicated line per call",
      "Printing in sections",
      "Compressing images",
    ],
    0,
    "Packets are routed independently and re-assembled at the destination.",
  ],
  [
    "I",
    "Which statement about a MAC address is true?",
    [
      "It changes every minute",
      "It is a unique hardware address of a NIC",
      "It is assigned by DHCP",
      "It is the same as an IPv4 address",
    ],
    1,
    "MAC addresses identify the network card; IP addresses identify the device on a network.",
  ],
  [
    "I",
    "What does DHCP do?",
    [
      "Translates domain names",
      "Automatically assigns IP addresses to devices",
      "Encrypts traffic",
      "Blocks websites",
    ],
    1,
    "DHCP gives each device an IP address when it joins the network.",
  ],
  [
    "I",
    "What does a UPS provide?",
    [
      "Faster Wi-Fi",
      "Battery power during a mains failure",
      "More switch ports",
      "Encryption",
    ],
    1,
    "A UPS keeps critical devices running when mains power is lost.",
  ],
  [
    "I",
    "What is a VLAN?",
    [
      "A faster cable",
      "A logical network created inside a switch by grouping ports",
      "A type of firewall",
      "A backup power unit",
    ],
    1,
    "VLANs separate traffic on one physical switch.",
  ],
  [
    "I",
    "What does a default route (0.0.0.0) tell a router?",
    [
      "Where to send traffic that matches no other route",
      "To shut down",
      "To assign IPs",
      "To encrypt packets",
    ],
    0,
    "It is the next hop used when no more specific route matches.",
  ],
];
/* ===== STATE ===== */
const $ = (id) => document.getElementById(id),
  cv = $("c"),
  cx = cv.getContext("2d");
let lv,
  lay,
  mode = "wall",
  tool = "cat5e",
  nodes = [],
  cables = [],
  pkts = [],
  sel = null,
  hl = null,
  pulse = null,
  sim = { m: "none", tl: [], i: 0, el: 0 },
  paused = false,
  si = 0,
  raf,
  last = 0,
  out = false,
  cliN = null;
const ports = (n) => (DEV[n.type] ? DEV[n.type].p : n.type == "server" ? 4 : 2);
const cl = (id) => $(id).classList.remove("open");
function logM(t, c = "") {
  const l = $("log");
  l.innerHTML += `<div class="${c}">&gt; ${t}</div>`;
  l.scrollTop = l.scrollHeight;
}
function banner(b, c) {
  $("pb").textContent = b;
  $("cap").textContent = c;
}
function hlB(id) {
  document.querySelectorAll(".bk").forEach((b) => b.classList.remove("act"));
  if (id) $(id).classList.add("act");
}
/* ===== 3. LEVEL LOADING ===== */
function fillSel() {
  $("lvS").innerHTML = LEVELS.map(
    (l) => `<option value="${l.id}">${l.title}</option>`,
  ).join("");
}
function loadLevel(id) {
  lv = LEVELS.find((l) => l.id == id) || LEVELS[0];
  lay = lv.layouts[0];
  $("lvS").value = lv.id;
  $("lyS").innerHTML = lv.layouts
    .map((l) => `<option value="${l.id}">${l.name}</option>`)
    .join("");
  $("brief").textContent = lv.brief;
  $("tag").textContent = lv.tag;
  $("bud").textContent = "$" + lv.budget;
  $("bId").value = lv.start.id;
  $("bPr").value = lv.start.prn;
  $("bIo").value = lv.start.iot;
  $("bInc").value = lv.start.inc;
  $("objs").innerHTML = lv.obj.map((o) => `<li>${o}</li>`).join("");
  resetLevel();
}
function swLay(id) {
  lay = lv.layouts.find((l) => l.id == id) || lv.layouts[0];
  resetLevel();
}
function resetLevel() {
  cancelAnimationFrame(raf);
  sim = { m: "none", tl: [], i: 0, el: 0 };
  paused = false;
  out = false;
  hl = pulse = sel = null;
  hlB();
  $("pz").textContent = "Pause";
  nodes = JSON.parse(JSON.stringify(lay.nodes));
  cables = [];
  pkts = [];
  $("pk").textContent =
    "0 / " + nodes.filter((n) => EP.includes(n.type)).length;
  $("log").innerHTML =
    `<div class=i>&gt; Loaded ${lv.title} (${lay.name}).</div>`;
  banner(
    "IDLE",
    "Choose a cable, click two devices to wire them, place devices, then Run Test.",
  );
  econ();
  draw();
}
function setMode(m) {
  mode = m;
  $("mW").classList.toggle("on", m == "wall");
  $("mR").classList.toggle("on", m == "roof");
  logM(
    m == "wall"
      ? "Along Wall: wall-drill fees apply."
      : "Through Roof: ceiling-drop fees apply.",
    "i",
  );
}
/* ===== 4. ROUTING, COSTS, TOPOLOGY ===== */
const roomAt = (x, y) =>
  lay.rooms.find((r) => x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h);
const clean = (p) =>
  p.filter((q, i) => !i || q.x != p[i - 1].x || q.y != p[i - 1].y);
function buildPath(a, b, m) {
  if (m == "roof")
    return clean([
      { x: a.x, y: a.y },
      { x: b.x, y: a.y },
      { x: b.x, y: b.y },
    ]);
  const ra = roomAt(a.x, a.y),
    rb = roomAt(b.x, b.y),
    p = [{ x: a.x, y: a.y }];
  if (ra) {
    const ey =
      Math.abs(a.y - ra.y) <= Math.abs(ra.y + ra.h - 1 - a.y)
        ? ra.y
        : ra.y + ra.h - 1;
    p.push({ x: a.x, y: ey }, { x: b.x, y: ey });
  } else p.push({ x: b.x, y: a.y });
  if (rb) {
    const l = p[p.length - 1],
      ex =
        Math.abs(b.x - rb.x) <= Math.abs(rb.x + rb.w - 1 - b.x)
          ? rb.x
          : rb.x + rb.w - 1;
    p.push({ x: ex, y: l.y }, { x: ex, y: b.y });
  }
  p.push({ x: b.x, y: b.y });
  return clean(p);
}
function measure(p, m) {
  let cells = 0,
    drills = 0;
  for (let i = 0; i < p.length - 1; i++) {
    const a = p[i],
      b = p[i + 1];
    cells += Math.abs(b.x - a.x) + Math.abs(b.y - a.y);
    if (m == "wall")
      lay.walls.forEach((w) => {
        if (w.x1 == w.x2 && a.y == b.y) {
          if (
            Math.min(a.x, b.x) < w.x1 &&
            Math.max(a.x, b.x) >= w.x1 &&
            a.y >= w.y1 &&
            a.y < w.y2
          )
            drills++;
        } else if (w.y1 == w.y2 && a.x == b.x) {
          if (
            Math.min(a.y, b.y) < w.y1 &&
            Math.max(a.y, b.y) >= w.y1 &&
            a.x >= w.x1 &&
            a.x < w.x2
          )
            drills++;
        }
      });
  }
  return { meters: cells * lv.mpc, drills, roofDrops: m == "roof" ? 2 : 0 };
}
function mkCable(f, t, type, m, dp) {
  const a = nodes.find((n) => n.id == f),
    b = nodes.find((n) => n.id == t),
    path = buildPath(a, b, m),
    r = measure(path, m),
    c = { from: f, to: t, type, mode: m, path, segOffsets: [], dp, ...r };
  cables.push(c);
  offsets();
  return c;
}
function offsets() {
  const u = new Map(),
    key = (c, i) => {
      const a = c.path[i],
        b = c.path[i + 1],
        k1 = `${a.x},${a.y}>${b.x},${b.y}`,
        k2 = `${b.x},${b.y}>${a.x},${a.y}`;
      return c.mode + ":" + (k1 < k2 ? k1 : k2);
    };
  const lane = cables.map((c) =>
    c.path.slice(1).map((_, i) => {
      const k = key(c, i),
        n = u.get(k) || 0;
      u.set(k, n + 1);
      return [k, n];
    }),
  );
  cables.forEach(
    (c, ci) =>
      (c.segOffsets = lane[ci].map(([k, n]) => (n - (u.get(k) - 1) / 2) * 6)),
  );
}
function topo() {
  if (!cables.length) return "None";
  const d = new Map();
  cables.forEach((c) => {
    d.set(c.from, (d.get(c.from) || 0) + 1);
    d.set(c.to, (d.get(c.to) || 0) + 1);
  });
  const v = [...d.values()],
    mx = Math.max(...v),
    hub = nodes.some((n) => DEV[n.type] || n.type == "server");
  if (v.length >= 3 && v.every((x) => x == 2)) return "Ring";
  if (hub && mx >= 3)
    return cables.length > nodes.length - 1 ? "Hybrid (Star+Mesh)" : "Star";
  if (mx <= 2 && cables.length >= 2) return "Bus / Chain";
  return "Hybrid / Mesh";
}
function econ() {
  let t = 0,
    d = 0,
    r = 0;
  nodes.forEach((n) => {
    if (DEV[n.type]) t += DEV[n.type].$;
  });
  cables.forEach((c) => {
    t += c.meters * CAB[c.type].c + c.drills * lv.drill + c.roofDrops * lv.roof;
    d += c.drills;
    r += c.roofDrops;
  });
  $("cost").textContent = "$" + t;
  $("cost").style.color = t <= lv.budget ? "var(--g)" : "var(--r)";
  $("dr").textContent = d;
  $("rf").textContent = r;
  $("topo").textContent = topo();
  return t;
}
const nd = (id) => nodes.find((n) => n.id == id),
  INF = (n) => (DEV[n.type] && n.type != "ups") || n.type == "server",
  grp = (n) => (DEV[n.type] ? GRP(n.type) : "");
const portOf = (n, k) =>
    cables.filter((c) => c.from == n.id || c.to == n.id).indexOf(k) + 1,
  cfgOf = (n) => n.cfg || (n.cfg = { routes: [], vlans: {}, down: [] });
const vl = (n, k) => (n.cfg && n.cfg.vlans[portOf(n, k)]) || 1,
  dn = (n, k) => n.cfg && n.cfg.down.includes(portOf(n, k));
/* Power model: during an outage, infrastructure only works if a UPS is within 5 cells (6 outlets, nearest first) */
function pw(n) {
  if (!out || !INF(n)) return true;
  return nodes.some(
    (u) =>
      u.type == "ups" &&
      nodes
        .filter((m) => INF(m) && Math.hypot(m.x - u.x, m.y - u.y) <= PR)
        .sort(
          (a, b) =>
            Math.hypot(a.x - u.x, a.y - u.y) - Math.hypot(b.x - u.x, b.y - u.y),
        )
        .slice(0, 6)
        .includes(n),
  );
}
/* Routing honours power, shut-down ports, VLANs and unconfigured routers */
function route(a, b, skip) {
  const q = [[[a], null]],
    seen = new Set([a]);
  if (!pw(nd(a))) return null;
  while (q.length) {
    const [p, last] = q.shift(),
      c = p[p.length - 1];
    if (c == b) return p;
    const cn = nd(c);
    for (const k of cables) {
      if (k === skip || (k.from != c && k.to != c)) continue;
      const n = nd(k.from == c ? k.to : k.from);
      if (seen.has(n.id) || !pw(n) || dn(cn, k) || dn(n, k)) continue;
      if (grp(cn) == "sw" && last && vl(cn, last) != vl(cn, k)) continue;
      if (lv.req && lv.req.cfg && grp(cn) == "rt" && !(cn.cfg && cn.cfg.ip))
        continue;
      seen.add(n.id);
      q.push([[...p, n.id], k]);
    }
  }
  return null;
}
/* ===== 5. PLAY (click to place / wire) ===== */
cv.addEventListener("click", (e) => {
  if (sim.m != "none") return;
  const r = cv.getBoundingClientRect(),
    k = cv.width / r.width,
    gx = Math.floor(((e.clientX - r.left) * k) / CELL),
    gy = Math.floor(((e.clientY - r.top) * k) / CELL),
    hit = nodes.find((n) => n.x == gx && n.y == gy);
  if (tool == "cfg") {
    if (hit && INF(hit) && hit.type != "server") openCli(hit);
    return;
  }
  if (DEV[tool]) {
    if (!hit && gx >= 1 && gx < 19 && gy >= 1 && gy < 11) {
      const d = DEV[tool];
      nodes.push({
        id: "d" + Date.now() + Math.random().toString(36).slice(2, 5),
        type: tool,
        label: d.n,
        x: gx,
        y: gy,
        ip: null,
      });
      pulse = { x: gx, y: gy, col: d.col, r: 18 };
      logM(`Placed ${d.n} at (${gx}, ${gy}) [-$${d.$}]`);
      econ();
      draw();
    }
    return;
  }
  if (!hit) return;
  if (!sel) sel = hit;
  else if (sel.id != hit.id) {
    const u = (n) =>
      cables.filter((c) => c.from == n.id || c.to == n.id).length;
    if (u(sel) >= ports(sel) || u(hit) >= ports(hit))
      logM(
        `Port limit reached on ${u(sel) >= ports(sel) ? sel.label : hit.label}!`,
        "e",
      );
    else {
      const c = mkCable(sel.id, hit.id, tool, mode, 1);
      logM(
        `Wired ${sel.label} <-> ${hit.label}: ${c.meters}m ${tool} [${mode}] (${mode == "wall" ? c.drills + " drills" : c.roofDrops + " roof drops"})`,
      );
      econ();
    }
    sel = null;
  }
  draw();
});
const tb = $("tbar");
Object.keys(CAB).forEach((k) =>
  tb.insertAdjacentHTML(
    "beforeend",
    `<button class="tl${k == tool ? " on" : ""}" data-t="${k}">${k} ($${CAB[k].c}/m)</button>`,
  ),
);
tb.insertAdjacentHTML(
  "beforeend",
  '<select id=dvS><option value="">Place device…</option>' +
    Object.entries(GL)
      .map(
        ([g, l]) =>
          `<optgroup label="${l}">` +
          Object.keys(DEV)
            .filter((k) => GRP(k) == g)
            .map(
              (k) => `<option value="${k}">${DEV[k].n} ($${DEV[k].$})</option>`,
            )
            .join("") +
          "</optgroup>",
      )
      .join("") +
    "</select><button class=tl data-t=cfg>⚙ Configure</button>",
);
$("dvS").onchange = (e) => {
  if (e.target.value) {
    tool = e.target.value;
    sel = null;
    tb.querySelectorAll(".tl").forEach((x) => x.classList.remove("on"));
  }
};
tb.querySelectorAll(".tl").forEach(
  (b) =>
    (b.onclick = () => {
      tb.querySelectorAll(".tl").forEach((x) => x.classList.remove("on"));
      b.classList.add("on");
      tool = b.dataset.t;
      $("dvS").value = "";
      sel = null;
      draw();
    }),
);
/* ===== 6. DHCP + SIMULATION ENGINE ===== */
function plan() {
  let h = +$("bId").value;
  const pr = +$("bPr").value,
    io = +$("bIo").value,
    inc = +$("bInc").value;
  return nodes
    .filter((n) => EP.includes(n.type))
    .map((n) => {
      let ip,
        b = "bpc",
        note = "host_id = " + h;
      if (n.type == "printer") {
        ip = pr;
        b = "bpr";
        note = "static Printer IP";
      } else if (n.type == "iot") {
        ip = io;
        b = "bio";
        note = "static IoT IP";
      } else {
        ip = h;
        h += inc;
      }
      return { n, ip: "192.168.1." + ip, b, note };
    });
}
function startSim() {
  resetLevel();
  logM("Starting timed setup simulation...", "i");
  const dm = lv.demo,
    tl = [];
  dm.devs.forEach((d) =>
    tl.push({
      k: "d",
      d: 800,
      v: { id: d[0], type: d[1], x: d[2], y: d[3] },
      b: "PHASE 1: HARDWARE",
      c: `Installing ${DEV[d[1]].n} at (${d[2]}, ${d[3]}) for $${DEV[d[1]].$}...`,
    }),
  );
  dm.links.forEach((l) =>
    tl.push({
      k: "c",
      d: 850,
      l,
      b: "PHASE 2: CABLING",
      c: `Pulling ${l[2].toUpperCase()} (${dm.mode == "wall" ? "Along Wall" : "Through Roof"}) from ${lab(l[0])} to ${lab(l[1])}...`,
    }),
  );
  tl.push({
    k: "v",
    d: 550,
    blk: "bv",
    b: "PHASE 3: DHCP SCRIPT",
    c: `Initialising host_id = ${$("bId").value}.`,
  });
  plan().forEach((a) =>
    tl.push({
      k: "i",
      d: 750,
      n: a.n.id,
      ip: a.ip,
      blk: a.b,
      b: "PHASE 3: DHCP SCRIPT",
      c: `Assigning ${a.ip} to ${a.n.label} (${a.note}).`,
    }),
  );
  (dm.cli || []).forEach(([id, cmd]) =>
    tl.push({
      k: "x",
      d: 700,
      n: id,
      cmd,
      b: "PHASE 3: DEVICE CONFIG",
      c: `Configuring ${lab(id)}: ${cmd}`,
    }),
  );
  sim = { m: "build", tl, i: 0, el: 0 };
  last = performance.now();
  tick(last);
}
function lab(id) {
  const n = lay.nodes.find((n) => n.id == id);
  if (n) return n.label;
  const d = lv.demo.devs.find((d) => d[0] == id);
  return d ? DEV[d[1]].n : id;
}
function ap(s, t) {
  banner(s.b, s.c);
  hlB(s.blk);
  hl = null;
  if (s.k == "d") {
    const v = s.v;
    if (!nodes.some((n) => n.id == v.id)) {
      nodes.push({
        id: v.id,
        type: v.type,
        label: DEV[v.type].n,
        x: v.x,
        y: v.y,
        ip: null,
      });
      logM(`Placed ${DEV[v.type].n} at (${v.x}, ${v.y}) [-$${DEV[v.type].$}]`);
      econ();
    }
    hl = v.id;
    pulse = { x: v.x, y: v.y, col: DEV[v.type].col, r: 10 + t * 14 };
  } else if (s.k == "c") {
    let c = cables.find((c) => c.from == s.l[0] && c.to == s.l[1]);
    if (!c) c = mkCable(s.l[0], s.l[1], s.l[2], lv.demo.mode, 0);
    c.dp = t;
    if (t >= 1 && !c.lg) {
      c.lg = 1;
      logM(
        `Connected ${lab(c.from)} <-> ${lab(c.to)} (${c.meters}m ${c.type}, ${c.mode})`,
      );
      econ();
    }
  } else if (s.k == "i") {
    const n = nodes.find((n) => n.id == s.n);
    if (n.ip != s.ip) {
      n.ip = s.ip;
      logM(`Assigned ${s.ip} -> ${n.label}`, "o");
    }
    hl = s.n;
  } else if (s.k == "x") {
    if (!s.dn) {
      s.dn = 1;
      runCmd(nd(s.n), s.cmd);
      logM(`${lab(s.n)}> ${s.cmd}`, "o");
    }
    hl = s.n;
  }
}
function fin() {
  hl = pulse = null;
  hlB();
  paused = false;
  $("pz").textContent = "Pause";
  sim.m = "pk";
  banner(
    "PHASE 4: TRAFFIC TEST",
    "Setup complete! Sending packets to the destination...",
  );
  test(true);
}
function runT() {
  cancelAnimationFrame(raf);
  paused = false;
  $("pz").textContent = "Pause";
  sim.m = "pk";
  test(false);
}
function checkReq() {
  const q = lv.req || {},
    need = {};
  (q.dev || []).forEach((t) => (need[t] = (need[t] || 0) + 1));
  for (const t in need)
    if (nodes.filter((n) => n.type == t).length < need[t])
      return `Needs ${need[t]} x ${DEV[t].n}.`;
  if (q.cab && !cables.some((c) => q.cab.includes(c.type)))
    return `Use ${q.cab.join(" or ")} on at least one link.`;
  for (const [g, k, v] of q.cfg || []) {
    if (
      !nodes.some(
        (n) =>
          grp(n) == g &&
          n.cfg &&
          (k == "ip"
            ? n.cfg.ip
            : k == "pool"
              ? n.cfg.pool
              : k == "gw"
                ? n.cfg.gw
                : k == "route"
                  ? n.cfg.routes.some((r) => r.startsWith(v))
                  : k == "vlan"
                    ? Object.values(n.cfg.vlans).includes(v)
                    : n.cfg.down.length),
      )
    )
      return `Configure the ${g == "sw" ? "switch" : "router"}: ${k}${v ? " " + v : ""} (click ⚙ Configure, then the device).`;
  }
  if (q.ups && !nodes.some((n) => n.type == "ups"))
    return "Add a UPS so the network survives a power outage.";
  return null;
}
function test(demo) {
  cancelAnimationFrame(raf);
  pkts = [];
  const q = lv.req || {},
    T = q.target || "srv_1",
    cost = econ();
  const fail = (b, m) => {
    logM(m, "e");
    banner(b, m);
    sim.m = "none";
  };
  if (cost > lv.budget)
    return fail("OVER BUDGET", `OVER BUDGET: $${cost} > $${lv.budget}.`);
  const oe = checkReq();
  if (oe) return fail("OBJECTIVE MISSING", oe);
  if (q.ups && !out) {
    out = true;
    logM("MAINS POWER OFF: running on UPS battery only...", "i");
  }
  if (!demo) {
    plan().forEach((a) => (a.n.ip = a.ip));
    cables.forEach((c) => (c.dp = 1));
    draw();
  }
  const ips = nodes.filter((n) => n.ip).map((n) => n.ip);
  if (new Set(ips).size != ips.length)
    return fail(
      "IP CONFLICT",
      "IP CONFLICT: two devices share one IPv4 address. Check the DHCP blocks!",
    );
  const aps = nodes.filter((n) => n.type == "ap"),
    eps = nodes.filter((n) => EP.includes(n.type)),
    np = [];
  for (const ep of eps) {
    let st = ep,
      w = null;
    if (ep.wireless) {
      const a = aps.find((a) => Math.hypot(ep.x - a.x, ep.y - a.y) <= WR);
      if (!a)
        return fail(
          "WI-FI OUT OF RANGE",
          `${ep.label} is outside every AP coverage circle.`,
        );
      st = a;
      w = [ep, a];
    }
    const path = route(st.id, T);
    if (!path)
      return fail(
        "DISCONNECTED",
        `${ep.label} has no wired route to the destination${out ? " while mains power is OFF: put a UPS within 5 cells of the switch, AP and Server" : ""}.`,
      );
    const miss = (q.path || []).find(
      (t) => !path.some((id) => nodes.find((n) => n.id == id).type == t),
    );
    if (miss)
      return fail(
        "MISSING " + DEV[miss].n.toUpperCase(),
        `Traffic from ${ep.label} must pass through a ${DEV[miss].n}.`,
      );
    np.push({ w, path, s: 0, t: 0 });
  }
  if (q.red) {
    const bb = cables.filter(
      (c) =>
        ![c.from, c.to].some((id) =>
          EP.includes(nodes.find((n) => n.id == id).type),
        ),
    );
    if (bb.length < 3)
      return fail(
        "NO BACKUP LINKS",
        "Add backbone links so the switches and Server form a loop.",
      );
    for (const c of bb)
      for (const ep of eps) {
        const s = ep.wireless ? aps[0] : ep;
        if (s && !route(s.id, T, c))
          return fail(
            "SINGLE POINT OF FAILURE",
            `Cutting ${lab(c.from)}–${lab(c.to)} would disconnect ${ep.label}.`,
          );
      }
    logM("Cable-cut drill passed: every backbone link has a backup.", "o");
  }
  pkts = np;
  sim.m = "pk";
  $("pk").textContent = "0 / " + pkts.length;
  logM(`Sending packets (${topo()} topology)...`, "i");
  last = performance.now();
  tick(last);
}
function tick(now) {
  if (paused) return;
  const dt = (now - last) * SPD[si];
  last = now;
  if (sim.m == "build") {
    const s = sim.tl[sim.i];
    if (!s) {
      fin();
      return;
    }
    sim.el += dt;
    ap(s, Math.min(1, sim.el / s.d));
    if (sim.el >= s.d) {
      sim.i++;
      sim.el = 0;
    }
    draw();
    raf = requestAnimationFrame(tick);
    return;
  }
  if (sim.m == "pk") {
    let dn = 0;
    pkts.forEach((p) => {
      if (p.w) {
        p.t += 0.025 * SPD[si];
        if (p.t >= 1) {
          p.t = 0;
          p.w = null;
        }
        return;
      }
      if (p.s >= p.path.length - 1) {
        dn++;
        return;
      }
      const A = p.path[p.s],
        B = p.path[p.s + 1],
        c = cables.find(
          (c) => (c.from == A && c.to == B) || (c.from == B && c.to == A),
        );
      p.t += CAB[c.type].s * SPD[si];
      if (p.t >= 1) {
        p.t = 0;
        p.s++;
      }
    });
    $("pk").textContent = dn + " / " + pkts.length;
    draw();
    if (dn == pkts.length) {
      logM(
        `LEVEL COMPLETE! All ${pkts.length} packets delivered within $${lv.budget}.`,
        "o",
      );
      banner("COMPLETE", "All packets reached the destination within budget.");
      sim.m = "none";
      return;
    }
    raf = requestAnimationFrame(tick);
  }
}
function togglePause() {
  if (sim.m == "none") return;
  paused = !paused;
  $("pz").textContent = paused ? "Resume" : "Pause";
  if (!paused) {
    last = performance.now();
    tick(last);
  }
}
function cycSpd() {
  si = (si + 1) % SPD.length;
  $("spd").textContent = SPD[si] + "x";
}
function stepF() {
  if (sim.m != "build") return;
  paused = true;
  $("pz").textContent = "Resume";
  const s = sim.tl[sim.i];
  if (s) {
    ap(s, 1);
    sim.i++;
    sim.el = 0;
  }
  if (sim.i >= sim.tl.length) fin();
  draw();
}
/* ===== 7. CANVAS RENDERER ===== */
function pos(p) {
  if (p.w) {
    const [a, b] = p.w;
    return [
      (a.x + (b.x - a.x) * p.t) * CELL + CELL / 2,
      (a.y + (b.y - a.y) * p.t) * CELL + CELL / 2,
    ];
  }
  const A = p.path[p.s],
    B = p.path[p.s + 1],
    c = cables.find(
      (c) => (c.from == A && c.to == B) || (c.from == B && c.to == A),
    ),
    pt = c.path.map((q) => [q.x * CELL + CELL / 2, q.y * CELL + CELL / 2]);
  if (c.from != A) pt.reverse();
  const sg = [];
  let tot = 0;
  for (let i = 0; i < pt.length - 1; i++) {
    const d = Math.hypot(pt[i + 1][0] - pt[i][0], pt[i + 1][1] - pt[i][1]);
    sg.push(d);
    tot += d;
  }
  let d = p.t * tot;
  for (let i = 0; i < sg.length; i++) {
    if (d <= sg[i] || i == sg.length - 1) {
      const f = sg[i] ? Math.min(1, d / sg[i]) : 0;
      return [
        pt[i][0] + (pt[i + 1][0] - pt[i][0]) * f,
        pt[i][1] + (pt[i + 1][1] - pt[i][1]) * f,
      ];
    }
    d -= sg[i];
  }
}
function seg(a, b, o) {
  const x1 = a.x * CELL + CELL / 2,
    y1 = a.y * CELL + CELL / 2,
    x2 = b.x * CELL + CELL / 2,
    y2 = b.y * CELL + CELL / 2,
    l = Math.hypot(x2 - x1, y2 - y1) || 1,
    nx = (-(y2 - y1) / l) * o,
    ny = ((x2 - x1) / l) * o;
  return [x1 + nx, y1 + ny, x2 + nx, y2 + ny];
}
function draw() {
  cx.clearRect(0, 0, 760, 456);
  cx.fillStyle = "#0f172a";
  cx.fillRect(0, 0, 760, 456);
  if (ART.bg) cx.drawImage(ART.bg, 0, 0, 760, 456);
  cx.fillStyle = "#334155";
  for (let x = 0; x < 20; x++)
    for (let y = 0; y < 12; y++)
      cx.fillRect(x * CELL + CELL / 2 - 1, y * CELL + CELL / 2 - 1, 2, 2);
  lay.rooms.forEach((r) => {
    cx.fillStyle = "rgba(56,189,248,.05)";
    cx.fillRect(r.x * CELL, r.y * CELL, r.w * CELL, r.h * CELL);
    cx.strokeStyle = "#475569";
    cx.lineWidth = 2;
    cx.setLineDash([]);
    cx.strokeRect(r.x * CELL, r.y * CELL, r.w * CELL, r.h * CELL);
    cx.fillStyle = "#94a3b8";
    cx.font = "bold 11px sans-serif";
    cx.fillText(r.name.toUpperCase(), r.x * CELL + 8, r.y * CELL + 15);
  });
  cx.strokeStyle = "#f59e0b";
  cx.lineWidth = 4;
  lay.walls.forEach((w) => {
    cx.beginPath();
    cx.moveTo(w.x1 * CELL, w.y1 * CELL);
    cx.lineTo(w.x2 * CELL, w.y2 * CELL);
    cx.stroke();
  });
  nodes
    .filter((n) => n.type == "ups")
    .forEach((u) => {
      cx.save();
      cx.strokeStyle = "rgba(132,204,22,.5)";
      cx.setLineDash([3, 5]);
      cx.beginPath();
      cx.arc(u.x * CELL + CELL / 2, u.y * CELL + CELL / 2, PR * CELL, 0, 7);
      cx.stroke();
      cx.restore();
    });
  nodes
    .filter((n) => n.type == "ap")
    .forEach((a) => {
      cx.save();
      cx.fillStyle = "rgba(6,182,212,.09)";
      cx.strokeStyle = "rgba(34,211,238,.5)";
      cx.setLineDash([5, 5]);
      cx.beginPath();
      cx.arc(a.x * CELL + CELL / 2, a.y * CELL + CELL / 2, WR * CELL, 0, 7);
      cx.fill();
      cx.stroke();
      cx.restore();
    });
  cables.forEach((c) => {
    cx.save();
    cx.strokeStyle = CAB[c.type].col;
    cx.lineWidth = c.type == "fibre" ? 3.8 : c.type == "cat6a" ? 3.2 : 2.3;
    if (c.mode == "roof") cx.setLineDash([7, 5]);
    const pr = c.dp === undefined ? 1 : c.dp,
      n = c.path.length - 1,
      act = pr * n;
    for (let i = 0; i < n && i <= act; i++) {
      const f = i + 1 <= act ? 1 : act - i,
        s = seg(c.path[i], c.path[i + 1], c.segOffsets[i] || 0);
      cx.beginPath();
      cx.moveTo(s[0], s[1]);
      cx.lineTo(s[0] + (s[2] - s[0]) * f, s[1] + (s[3] - s[1]) * f);
      cx.stroke();
    }
    cx.restore();
  });
  if (pulse) {
    cx.strokeStyle = pulse.col;
    cx.lineWidth = 2.5;
    cx.beginPath();
    cx.arc(
      pulse.x * CELL + CELL / 2,
      pulse.y * CELL + CELL / 2,
      pulse.r || 18,
      0,
      7,
    );
    cx.stroke();
  }
  nodes.forEach((n) => {
    cx.globalAlpha = out && !pw(n) ? 0.3 : 1;
    const x = n.x * CELL + CELL / 2,
      y = n.y * CELL + CELL / 2,
      m = DEV[n.type] ? [DEV[n.type].col, DEV[n.type].ic] : FIX[n.type];
    if (hl == n.id) {
      cx.strokeStyle = "#facc15";
      cx.lineWidth = 3;
      cx.beginPath();
      cx.arc(x, y, 18, 0, 7);
      cx.stroke();
    }
    const im = ART.img[n.type];
    if (im) cx.drawImage(im, x - 16, y - 16, 32, 32);
    else {
      cx.fillStyle = sel && sel.id == n.id ? "#fff" : m[0];
      cx.shadowColor = m[0];
      cx.shadowBlur = 10;
      cx.beginPath();
      cx.arc(x, y, 13, 0, 7);
      cx.fill();
      cx.shadowBlur = 0;
      cx.fillStyle = "#0f172a";
      cx.font = "bold 9px sans-serif";
      cx.textAlign = "center";
      cx.fillText(m[1], x, y + 3);
    }
    cx.textAlign = "center";
    cx.fillStyle = "#f8fafc";
    cx.font = "bold 11px sans-serif";
    cx.fillText(n.label, x, y - 19);
    if (n.ip) {
      cx.fillStyle = "#4ade80";
      cx.font = "10px monospace";
      cx.fillText(n.ip, x, y + 27);
    }
    cx.textAlign = "left";
    cx.globalAlpha = 1;
  });
  pkts.forEach((p) => {
    if (!p.w && p.s >= p.path.length - 1) return;
    const q = pos(p);
    cx.fillStyle = "#4ade80";
    cx.shadowColor = "#4ade80";
    cx.shadowBlur = 8;
    cx.beginPath();
    cx.arc(q[0], q[1], 5.5, 0, 7);
    cx.fill();
    cx.shadowBlur = 0;
  });
}
/* ===== 8. MODALS: NOTES, SOLUTION, QUIZ ===== */
function openNotes(t) {
  $("ntt").innerHTML = NOTES.map(
    (n, i) =>
      `<button class="${i == t ? "on" : ""}" onclick="openNotes(${i})">${n[0]}</button>`,
  ).join("");
  $("ntb").innerHTML = NOTES[t][1]
    .map(
      (i) =>
        `<div class=cd><b>${i[0]}</b><br>${i[1]}<small>${i[2]}</small><a href="https://en.wikipedia.org/wiki/${i[4]}" target=_blank rel="noopener noreferrer">Wikipedia: ${i[3]}</a></div>`,
    )
    .join("");
  $("nt").classList.add("open");
}
function openSol() {
  $("solT").textContent = lv.title + " – Working Solution";
  const dm = lv.demo,
    s = [];
  dm.devs.forEach((d) =>
    s.push(`Place a ${DEV[d[1]].n} ($${DEV[d[1]].$}) at (${d[2]}, ${d[3]}).`),
  );
  dm.links.forEach((l) =>
    s.push(
      `Link ${lab(l[0])} to ${lab(l[1])} with ${l[2]} (${dm.mode == "wall" ? "Along Wall" : "Through Roof"}).`,
    ),
  );
  (dm.cli || []).forEach((c) => s.push(`Console on ${lab(c[0])}: ${c[1]}`));
  s.push(
    "Click Run Test. Tip: press “Simulate Setup” to watch it built step by step.",
  );
  $("solB").innerHTML = s
    .map((t, i) => `<div class=cd><b>${i + 1}.</b> ${t}</div>`)
    .join("");
  $("sol").classList.add("open");
}
let qs = [],
  qi = 0,
  qsc = 0;
function startQuiz(f) {
  qs = QZ.filter((q) => !f || q[0] == f);
  qi = qsc = 0;
  $("qz").classList.add("open");
  showQ();
}
function showQ() {
  const b = $("qb");
  if (qi >= qs.length) {
    b.innerHTML = `<div class=cd><b>Score: ${qsc} / ${qs.length}</b><br>${qsc == qs.length ? "Perfect! 🏆" : "Review the Study Notes and try again."}</div>`;
    return;
  }
  const q = qs[qi];
  b.innerHTML =
    `<span class=tg>${q[0] == "C" ? "Checkpoint" : "IGCSE"} · Q${qi + 1}/${qs.length}</span><b>${q[1]}</b>` +
    q[2]
      .map((o, i) => `<button class=qo onclick="ans(${i})">${o}</button>`)
      .join("") +
    "<div id=qf></div>";
}
function ans(i) {
  const q = qs[qi],
    bs = document.querySelectorAll(".qo");
  if (bs[0].disabled) return;
  bs.forEach((b, j) => {
    b.disabled = true;
    if (j == q[3]) b.classList.add("ok");
    else if (j == i) b.classList.add("no");
  });
  if (i == q[3]) qsc++;
  $("qf").innerHTML =
    `<div class=cd>${i == q[3] ? "✅ Correct! " : "❌ Not quite. "}${q[4]}</div><button class=sm onclick="qi++;showQ()">Next</button>`;
}
/* ===== 8b. DEVICE CONSOLE (CLI): student-edited switch & router configuration ===== */
const IPV = (x) => /^(\d{1,3}\.){3}\d{1,3}$/.test(x);
function runCmd(n, s) {
  const a = s.trim().split(/\s+/),
    c = cfgOf(n);
  let o = "% Unknown command. Type help";
  if (a[0] == "help")
    o =
      "ip address <ip> <mask>\nip default-gateway <ip>\nip route <net> <mask> <next-hop>\nno ip route <net>\ndhcp pool <first> <last>\nport <n> vlan <id>\nport <n> shutdown | enable\nshow";
  else if (a[0] == "ip" && a[1] == "address" && IPV(a[2]) && IPV(a[3])) {
    c.ip = a[2];
    c.mask = a[3];
    n.ip = a[2];
    o = "OK";
  } else if (a[0] == "ip" && a[1] == "default-gateway" && IPV(a[2])) {
    c.gw = a[2];
    o = "OK";
  } else if (
    a[0] == "ip" &&
    a[1] == "route" &&
    IPV(a[2]) &&
    IPV(a[3]) &&
    IPV(a[4])
  ) {
    c.routes.push(a[2] + " " + a[3] + " via " + a[4]);
    o = "OK";
  } else if (a[0] == "no" && a[1] == "ip" && a[2] == "route") {
    c.routes = c.routes.filter((r) => !r.startsWith(a[3]));
    o = "OK";
  } else if (a[0] == "dhcp" && a[1] == "pool" && IPV(a[2]) && IPV(a[3])) {
    c.pool = a[2] + " - " + a[3];
    o = "OK";
  } else if (a[0] == "port" && +a[1] > 0 && +a[1] <= ports(n)) {
    const p = +a[1];
    o = "OK";
    if (a[2] == "vlan" && +a[3] > 0) c.vlans[p] = +a[3];
    else if (a[2] == "shutdown") {
      if (!c.down.includes(p)) c.down.push(p);
    } else if (a[2] == "enable") c.down = c.down.filter((x) => x != p);
    else o = "% Incomplete command";
  } else if (a[0] == "show")
    o =
      `${n.label} ip=${c.ip || "unset"}/${c.mask || "-"} gw=${c.gw || "unset"} pool=${c.pool || "none"}\nroutes: ${c.routes.join("; ") || "none"}\n` +
      cables
        .filter((k) => k.from == n.id || k.to == n.id)
        .map((k) => {
          const p = portOf(n, k);
          return `port ${p} -> ${nd(k.from == n.id ? k.to : k.from).label}  vlan ${c.vlans[p] || 1}  ${c.down.includes(p) ? "DOWN" : "up"}`;
        })
        .join("\n");
  economy();
  draw();
  return o;
}
function economy() {
  econ();
}
function openCli(n) {
  cliN = n;
  $("cliT").textContent = n.label + " – Console";
  $("cliO").textContent =
    `${n.label}> type "help" for commands, "show" for ports.\n`;
  $("cli").classList.add("open");
  $("cliI").focus();
}
function cliRun(s) {
  $("cliO").textContent += `${cliN.label}> ${s}\n${runCmd(cliN, s)}\n`;
  $("cliO").scrollTop = 1e5;
}
/* ===== 9. LEVEL EDITOR & ART REPLACEMENT ===== */
function openEd() {
  $("eT").value = lv.title;
  $("eB").value = lv.brief;
  $("eBu").value = lv.budget;
  $("eD").value = lv.drill;
  $("eR").value = lv.roof;
  $("eJ").value = JSON.stringify(lv, null, 1);
  $("ed").classList.add("open");
}
function applyEd() {
  lv.title = $("eT").value;
  lv.brief = $("eB").value;
  lv.budget = +$("eBu").value;
  lv.drill = +$("eD").value;
  lv.roof = +$("eR").value;
  fillSel();
  loadLevel(lv.id);
  cl("ed");
}
function cpJ() {
  $("eJ").select();
  try {
    navigator.clipboard.writeText($("eJ").value);
  } catch (e) {}
}
function impJ() {
  try {
    const o = JSON.parse($("eJ").value),
      i = LEVELS.findIndex((l) => l.id == o.id);
    if (i < 0) LEVELS.push(o);
    else LEVELS[i] = o;
    fillSel();
    loadLevel(o.id);
    cl("ed");
  } catch (e) {
    alert("Invalid level JSON: " + e.message);
  }
}
function setArt(k, src) {
  if (!src) return;
  const im = new Image();
  im.onload = () => {
    k == "bg" ? (ART.bg = im) : (ART.img[k] = im);
    draw();
  };
  im.onerror = () => logM("Image failed to load; using default art.", "e");
  im.src = src;
}
function applyArt() {
  const k = $("aK").value,
    u = $("aU").value.trim(),
    f = $("aF").files[0];
  if (f) {
    const r = new FileReader();
    r.onload = () => setArt(k, r.result);
    r.readAsDataURL(f);
  } else setArt(k, u);
}
function resetArt() {
  ART.bg = null;
  ART.img = {};
  draw();
}
$("aK").innerHTML = ["bg", ...Object.keys(ASSET_CONFIG.sprites)]
  .map((k) => `<option>${k}</option>`)
  .join("");
setArt("bg", ASSET_CONFIG.bg);
Object.entries(ASSET_CONFIG.sprites).forEach(([k, v]) => setArt(k, v));
fillSel();
loadLevel(1);
