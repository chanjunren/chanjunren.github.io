🗓️ 17102026 2135

# apache_ant

Apache Ant is a Java-based build tool that executes tasks described in an XML build file.

An Ant project contains targets. Targets group tasks and can depend on other targets; when a target is requested, Ant runs its dependencies first. Tasks perform work such as compiling sources, copying files, or packaging an archive. Ant is deliberately flexible and does not impose a project layout or a standard lifecycle.

```xml
<project name="Example" default="jar">
  <target name="compile">
    <mkdir dir="build/classes"/>
    <javac srcdir="src" destdir="build/classes"/>
  </target>
  <target name="jar" depends="compile">
    <jar destfile="build/example.jar" basedir="build/classes"/>
  </target>
</project>
```

Run `ant jar` to request the `jar` target. Ant executes `compile` first because `jar` depends on it. Dependency management is separate; Ant can be paired with tools such as Apache Ivy.

## Related notes

- [[maven_phase]] — convention-based lifecycle phases
- [[bill_of_materials]] — centralized Maven dependency versions

## References

- [Apache Ant: Welcome](https://ant.apache.org/)
- [Apache Ant: Writing a simple buildfile](https://ant.apache.org/manual/using.html)
