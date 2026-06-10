# CCNA 200-301 Volume 2 Topic Map

Source analyzed locally:

- `F:\computer-networking\CiscoPress-CCNA-200-301-Official-Cert-Guide-Volume-2.pdf`
- `F:\computer-networking\CiscoPress-CCNA-200-301-Official-Cert-Guide-Volume-2.epub`

The EPUB navigation only exposed the notice entry, so the chapter structure was extracted from the PDF text layer.

## Study Modules

1. Transport, applications, and ACL thinking
   - Book chapters: 1-3
   - Topics: TCP, UDP, ports, DNS/HTTP basics, standard ACLs, wildcard masks, extended ACLs, named ACLs.
   - Proof: standard ACL lab, extended ACL lab, port/protocol testing, wildcard mask drill sheet.

2. Security architecture and device hardening
   - Book chapters: 4-6
   - Topics: common threats, security controls, IOS password handling, firewalls, IPS/NGFW, switch port security.
   - Proof: secure management config, port security lab, violation-mode notes.

3. DHCP, snooping, and ARP defense
   - Book chapters: 7-8
   - Topics: DHCP pools, relay, host IPv4 settings, DHCP snooping, rogue DHCP defense, Dynamic ARP Inspection.
   - Proof: DHCP server/relay lab, snooping binding table, DAI fault and fix.

4. Management and IP services
   - Book chapters: 9-12
   - Topics: syslog, NTP, CDP, LLDP, NAT/PAT, QoS, HSRP/FHRP, SNMP, FTP, TFTP.
   - Proof: NAT/PAT lab, HSRP lab, syslog/NTP/CDP/LLDP command outputs, QoS concept diagram.

5. Architecture: LAN, WAN, and cloud
   - Book chapters: 13-15
   - Topics: two-tier/three-tier campus, SOHO, PoE, Metro Ethernet, MPLS, internet VPN, virtualization, cloud service models, branch-to-cloud paths.
   - Proof: original diagrams for campus, WAN, cloud, and data center traffic paths.

6. Automation and programmability
   - Book chapters: 16-19
   - Topics: data/control/management planes, SDN, SDA, DNA Center, underlay/overlay, VXLAN, LISP, REST, JSON, YAML, config drift, Ansible, Puppet, Chef.
   - Proof: REST/JSON explanation, API request diagram, inventory/playbook notes, config drift example.

7. Final review and exam readiness
   - Book chapter: 20
   - Topics: practice exam review, CLI recall, wrong-answer repair, exam timing, self-assessment.
   - Proof: weak-topic list, command recall list, final lab checklist.

## Lab Folder Plan

Create these under `labs/ccna/` as work progresses:

- `acl-standard/`
- `acl-extended/`
- `port-security/`
- `dhcp-snooping-dai/`
- `nat-pat/`
- `hsrp/`
- `qos-basic/`
- `architecture/`
- `rest-json/`
- `ansible-config/`

Each folder should contain:

- Packet Tracer or GNS3 file where the topic is configurable.
- `topology.png` or an original diagram.
- `configs/` or command output text files.
- `notes.md` with concept, build steps, break-it task, troubleshooting, proof, and interview answer.

## Image And Packet Rule

Do not copy Cisco Press figures into the public repo. Use original diagrams drawn for this site. Packet files should be your own labs built from the topic requirements.
